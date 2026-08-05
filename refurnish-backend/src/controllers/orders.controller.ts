import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { formatOrderReference } from "../utils/orderReference";
import { initializePaystackTransaction, verifyPaystackTransaction } from "../utils/paystack";
import { Request } from "express";
import crypto from "crypto";
import {
  sendOrderPendingEmail,
  sendPaymentConfirmedEmail,
  sendSellerAvailabilityRequestEmail,
  sendPickupReadyEmail,
  sendItemUnavailableEmail,
  sendOrderRejectedEmail,
  sendDisputeFiledEmail,
  sendDisputeResolvedEmail,
} from "../utils/mailer";

const PLATFORM_FEE_PERCENT = 24;

async function createPayoutsForOrder(order: any) {
  // Guard against double-creation if this ever runs twice for the same order.
  const existing = await prisma.payout.findFirst({ where: { orderId: order.id } });
  if (existing) return;

  const items = (order.items as any[]) || [];
  for (const item of items) {
    if (!item.sellerId) continue; // can't attribute a payout without a known seller

    const gross = Number(item.price) * Number(item.quantity || 1);
    const fee = Math.round((gross * PLATFORM_FEE_PERCENT) / 100);
    const net = gross - fee;

    await prisma.payout.create({
      data: {
        sellerId: item.sellerId,
        orderId: order.id,
        listingId: item.listingId || null,
        itemTitle: item.itemTitle,
        grossAmount: String(gross),
        feePercent: PLATFORM_FEE_PERCENT,
        feeAmount: String(fee),
        netAmount: String(net),
        status: "pending",
      },
    });
  }
}

async function markOrderListingsSold(order: any) {
  const listingIds = (order.items as any[]).map((i) => i.listingId).filter(Boolean);
  if (!listingIds.length) return;
  await prisma.listing.updateMany({
    where: { id: { in: listingIds }, status: "active" },
    data: { status: "sold" },
  });
}

async function linkNegotiatedConversations(conversationIds: string[], orderId: string) {
  if (!conversationIds.length) return;
  await prisma.conversation.updateMany({
    where: { id: { in: conversationIds } },
    data: { offerStatus: "completed", orderId },
  });
  await prisma.message.createMany({
    data: conversationIds.map((id) => ({
      conversationId: id,
      role: "system",
      type: "order_placed",
      text: "Order placed! You can arrange pickup details here.",
    })),
  });
}

async function notifySellerConfirmations(order: any) {
  const itemsBySeller = new Map<string, any[]>();

  for (const item of order.items as any[]) {
    const key = item.sellerEmail || "unknown";
    if (!itemsBySeller.has(key)) itemsBySeller.set(key, []);
    itemsBySeller.get(key)!.push(item);
  }

  for (const [sellerEmail, items] of itemsBySeller) {
    if (!sellerEmail || sellerEmail === "unknown") continue;

    const token = crypto.randomBytes(24).toString("hex");

    await prisma.sellerConfirmation.create({
      data: {
        orderId: order.id,
        sellerEmail,
        sellerName: items[0].sellerName || "Seller",
        token,
        items,
      },
    });

    const confirmUrl = `${process.env.FRONTEND_URL}/seller/confirm-order?token=${token}`;
    await sendSellerAvailabilityRequestEmail(
      sellerEmail,
      items[0].sellerName || "Seller",
      items,
      confirmUrl
    );
  }

  await sendPaymentConfirmedEmail(order.email, order.fullName, order.reference);
}

export async function createOrder(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found." });

    const {
      cartItems, // [{ listingId, quantity }]
      deliveryType, fullName, phone, email,
      address, state, lga, landmark, deliveryDate, deliveryNotes,
      paymentMethod, receiptUrl,
    } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }
    if (!fullName || !phone || !email) {
      return res.status(400).json({ message: "Missing required checkout fields." });
    }
    if (paymentMethod === "transfer" && !receiptUrl) {
      return res.status(400).json({ message: "Please upload your payment receipt." });
    }
    if (!["paystack", "transfer"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method." });
    }

    // Backend looks up each listing itself — buyer's browser never sends or sees seller contact info.
    const listingIds = cartItems.map((c: any) => c.listingId);
    const listings = await prisma.listing.findMany({ where: { id: { in: listingIds } } });

    if (listings.length !== listingIds.length) {
      return res.status(400).json({ message: "One or more items in your cart are no longer available." });
    }

    const negotiatedConversationIds: string[] = [];

    const items = await Promise.all(
      cartItems.map(async (c: any) => {
        const listing = listings.find((l) => l.id === c.listingId)!;
        let price = Number(listing.sellingPrice) || 0;

        if (c.negotiatedPrice) {
          // Never trust the client's number outright — only apply it if it matches
          // a real accepted offer for THIS buyer on THIS listing.
          const acceptedConversation = await prisma.conversation.findUnique({
            where: { listingId_buyerId: { listingId: listing.id, buyerId: userId } },
          });

          if (
            acceptedConversation &&
            acceptedConversation.offerStatus === "accepted" &&
            acceptedConversation.agreedPrice &&
            Number(acceptedConversation.agreedPrice) === Number(c.negotiatedPrice)
          ) {
            price = Number(acceptedConversation.agreedPrice);
            negotiatedConversationIds.push(acceptedConversation.id);
          }
        }

        return {
          listingId: listing.id,
          sellerId: listing.sellerId,
          itemTitle: listing.itemTitle,
          image: listing.photos?.[0] || null,
          price,
          quantity: c.quantity || 1,
          sellerName: listing.sellerName,
          sellerEmail: listing.email,
          sellerPhone: listing.phone,
          sellerAddress: listing.address,
          sellerState: listing.state,
          sellerLga: listing.lga,
        };
      })
    );

    const subtotal = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
    const buyerProtection = 0;
    const total = subtotal;

    // Create the order first to get a sequential reference.
    // `reference` is required+unique, so we seed a temporary placeholder
    // and overwrite it with the real formatted reference right after insert.
    const order = await prisma.order.create({
      data: {
        reference: `TEMP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        buyerId: userId,
        items,
        subtotal: String(subtotal),
        buyerProtection: String(buyerProtection),
        total: String(total),
        deliveryType,
        fullName,
        phone,
        email,
        address: deliveryType === "delivery" ? address : null,
        state: deliveryType === "delivery" ? state : null,
        lga: deliveryType === "delivery" ? lga : null,
        landmark: deliveryType === "delivery" ? landmark : null,
        deliveryDate,
        deliveryNotes,
        paymentMethod,
        receiptUrl: paymentMethod === "transfer" ? receiptUrl : null,
        status: "pending_payment",
      },
    });

    let reference = formatOrderReference(order.referenceSeq);

    if (paymentMethod === "paystack") {
      const amountKobo = Math.round(total * 100);
      const callbackUrl = `${process.env.FRONTEND_URL}/checkout/verify`;

      let paystackData;
      let attempts = 0;

      // Paystack references must be globally unique on Paystack's side, which can
      // drift out of sync with our own sequence (e.g. after a DB reset). Retry with
      // a suffixed reference rather than failing the whole checkout.
      try {
        while (true) {
          try {
            paystackData = await initializePaystackTransaction({
              email,
              amountKobo,
              reference,
              callbackUrl,
            });
            break;
          } catch (err: any) {
            attempts += 1;
            if (err.message !== "Duplicate Transaction Reference" || attempts >= 3) {
              throw err;
            }
            reference = `${formatOrderReference(order.referenceSeq)}-${Date.now().toString(36).toUpperCase()}`;
          }
        }
      } catch (err) {
        // Paystack never accepted this order — don't leave an orphaned row behind.
        await prisma.order.delete({ where: { id: order.id } });
        throw err;
      }

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { reference, paystackReference: reference },
      });

      await linkNegotiatedConversations(negotiatedConversationIds, order.id);

      return res.status(201).json({
        message: "Order created. Redirecting to Paystack.",
        order: updated,
        authorizationUrl: paystackData.authorization_url,
      });
    } else {
      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { reference, status: "pending_verification" },
      });

      await linkNegotiatedConversations(negotiatedConversationIds, order.id);

      await sendOrderPendingEmail(email, fullName, reference, String(total));

      return res.status(201).json({
        message: "Order submitted. We'll confirm your payment shortly.",
        order: updated,
      });
    }
  } catch (err: any) {
    console.error("Create order error:", err);
    return res.status(500).json({ message: err.message || "Something went wrong." });
  }
}

export async function verifyPaystackOrder(req: AuthRequest, res: Response) {
  try {
    const reference = req.params.reference as string;

    const order = await prisma.order.findUnique({ where: { reference } });
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.status === "confirmed") {
      return res.status(200).json({ message: "Already confirmed.", order });
    }

    const paystackData = await verifyPaystackTransaction(reference);

    if (paystackData.status !== "success") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "payment_failed" },
      });
      return res.status(400).json({ message: "Payment was not successful." });
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: "confirmed", reviewedAt: new Date() },
    });

    await markOrderListingsSold(updated);
    await notifySellerConfirmations(updated);

    return res.status(200).json({ message: "Payment verified.", order: updated });
  } catch (err: any) {
    console.error("Verify Paystack order error:", err);
    return res.status(500).json({ message: err.message || "Something went wrong." });
  }
}

export async function getSellerConfirmation(req: Request, res: Response) {
  try {
    const token = req.params.token as string;

    const confirmation = await prisma.sellerConfirmation.findUnique({
      where: { token },
      include: { order: true },
    });

    if (!confirmation) {
      return res.status(404).json({ message: "This confirmation link is invalid or has expired." });
    }

    return res.status(200).json({
      confirmation: {
        sellerName: confirmation.sellerName,
        items: confirmation.items,
        availability: confirmation.availability,
        respondedAt: confirmation.respondedAt,
        orderReference: confirmation.order.reference,
      },
    });
  } catch (err) {
    console.error("Get seller confirmation error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function respondSellerConfirmation(req: Request, res: Response) {
  try {
    const token = req.params.token as string;
    const { available } = req.body;

    if (typeof available !== "boolean") {
      return res.status(400).json({ message: "Missing availability response." });
    }

    const confirmation = await prisma.sellerConfirmation.findUnique({
      where: { token },
      include: { order: true },
    });

    if (!confirmation) {
      return res.status(404).json({ message: "This confirmation link is invalid or has expired." });
    }

    if (confirmation.availability) {
      return res.status(200).json({ message: "You've already responded to this order." });
    }

    const updated = await prisma.sellerConfirmation.update({
      where: { token },
      data: {
        availability: available ? "available" : "unavailable",
        respondedAt: new Date(),
      },
    });

    const order = confirmation.order;

    if (available) {
      const ordersUrl = `${process.env.FRONTEND_URL}/dashboard/orders/${order.id}`;
      await sendPickupReadyEmail(order.email, order.fullName, order.reference, confirmation.items as any, ordersUrl);
    } else {
      await sendItemUnavailableEmail(order.email, order.fullName, order.reference, confirmation.items as any);
    }

    return res.status(200).json({ message: "Response recorded.", confirmation: updated });
  } catch (err) {
    console.error("Respond seller confirmation error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function getMyOrders(req: AuthRequest, res: Response) {
  try {
    const orders = await prisma.order.findMany({
      where: { buyerId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ orders });
  } catch (err) {
    console.error("Get my orders error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function getMyOrderById(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { reviews: true, disputes: true, sellerConfirmations: true },
    });

    if (!order || order.buyerId !== req.userId) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json({ order });
  } catch (err) {
    console.error("Get order by id error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function confirmOrderReceived(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order || order.buyerId !== req.userId) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.status !== "confirmed") {
      return res.status(400).json({ message: "This order can't be marked as received yet." });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: "completed", deliveryConfirmedAt: new Date() },
    });

    await createPayoutsForOrder(updated);

    return res.status(200).json({ message: "Order marked as received.", order: updated });
  } catch (err) {
    console.error("Confirm received error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function submitReview(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const { rating, comment, recommend } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "A rating between 1 and 5 is required." });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { reviews: true },
    });

    if (!order || order.buyerId !== req.userId) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.status !== "completed") {
      return res.status(400).json({ message: "You can only review a completed order." });
    }

    if (order.reviews.length > 0) {
      return res.status(400).json({ message: "You've already reviewed this order." });
    }

    const review = await prisma.review.create({
      data: {
        orderId: id,
        buyerId: req.userId!,
        rating,
        comment: comment || null,
        recommend: typeof recommend === "boolean" ? recommend : null,
      },
    });

    return res.status(201).json({ message: "Review submitted.", review });
  } catch (err) {
    console.error("Submit review error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function fileDispute(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const { reason, description } = req.body;

    if (!reason || !description || description.trim().length < 20) {
      return res.status(400).json({ message: "Please provide a reason and a description of at least 20 characters." });
    }

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order || order.buyerId !== req.userId) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (!["confirmed", "completed"].includes(order.status)) {
      return res.status(400).json({ message: "A dispute can only be filed on a confirmed order." });
    }

    const dispute = await prisma.dispute.create({
      data: {
        orderId: id,
        buyerId: req.userId!,
        reason,
        description: description.trim(),
      },
    });

    await prisma.order.update({ where: { id }, data: { status: "disputed" } });

    await sendDisputeFiledEmail(order.email, order.fullName, order.reference);

    return res.status(201).json({ message: "Dispute filed.", dispute });
  } catch (err) {
    console.error("File dispute error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function getAllOrders(_req: AuthRequest, res: Response) {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ orders });
  } catch (err) {
    console.error("Get all orders error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function reviewOrder(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const { status, rejectionReason } = req.body;

    if (!["confirmed", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'confirmed' or 'rejected'." });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === "rejected" ? rejectionReason || "" : null,
        reviewedAt: new Date(),
      },
    });

    if (status === "confirmed") {
      await markOrderListingsSold(order);
      await notifySellerConfirmations(order);
    } else {
      await sendOrderRejectedEmail(
        order.email,
        order.fullName,
        order.reference,
        rejectionReason || "We could not verify this payment."
      );
    }

    return res.status(200).json({ message: `Order marked as ${status}.`, order });
  } catch (err) {
    console.error("Review order error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function getAllDisputes(_req: AuthRequest, res: Response) {
  try {
    const disputes = await prisma.dispute.findMany({
      include: { order: true },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ disputes });
  } catch (err) {
    console.error("Get all disputes error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function resolveDispute(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const { resolution } = req.body;

    if (!resolution || !resolution.trim()) {
      return res.status(400).json({ message: "A resolution note is required." });
    }

    const dispute = await prisma.dispute.update({
      where: { id },
      data: { status: "resolved", resolution: resolution.trim(), resolvedAt: new Date() },
      include: { order: true },
    });

    await sendDisputeResolvedEmail(
      dispute.order.email,
      dispute.order.fullName,
      dispute.order.reference,
      resolution.trim()
    );

    return res.status(200).json({ message: "Dispute resolved.", dispute });
  } catch (err) {
    console.error("Resolve dispute error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}