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
} from "../utils/mailer";

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

    const items = cartItems.map((c: any) => {
      const listing = listings.find((l) => l.id === c.listingId)!;
      return {
        listingId: listing.id,
        itemTitle: listing.itemTitle,
        image: listing.photos?.[0] || null,
        price: Number(listing.sellingPrice) || 0,
        quantity: c.quantity || 1,
        sellerName: listing.sellerName,
        sellerEmail: listing.email,
        sellerPhone: listing.phone,
        sellerAddress: listing.address,
        sellerState: listing.state,
        sellerLga: listing.lga,
      };
    });

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

    const reference = formatOrderReference(order.referenceSeq);

    if (paymentMethod === "paystack") {
      const amountKobo = Math.round(total * 100);
      const callbackUrl = `${process.env.FRONTEND_URL}/checkout/verify`;

      const paystackData = await initializePaystackTransaction({
        email,
        amountKobo,
        reference,
        callbackUrl,
      });

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { reference, paystackReference: reference },
      });

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
      await sendPickupReadyEmail(order.email, order.fullName, order.reference, confirmation.items as any);
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