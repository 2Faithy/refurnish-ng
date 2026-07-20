import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  sendListingSubmittedEmail,
  sendListingApprovedEmail,
  sendListingRejectedEmail,
} from "../utils/mailer";
import { validateListingPayload } from "../utils/validateListing";

export async function createListing(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const {
      photos, itemTitle, category, brand, model, condition, defects,
      conditionNotes, age, color, material, dimLength, dimWidth, dimHeight,
      dimWeight, description, tags, originalPrice, sellingPrice, negotiable,
      sellReason, availability, urgency, sellerName, phone, email, whatsapp,
      callTime, address, state, lga, warranty, warrantyDuration,
    } = req.body;

    const validation = validateListingPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const listing = await prisma.listing.create({
      data: {
        sellerId: userId,
        photos: photos || [],
        itemTitle,
        category,
        brand,
        model,
        condition,
        defects: defects || [],
        conditionNotes,
        age,
        color,
        material,
        dimLength,
        dimWidth,
        dimHeight,
        dimWeight,
        description,
        tags: tags || [],
        originalPrice,
        sellingPrice,
        negotiable: negotiable ?? true,
        sellReason,
        availability,
        urgency,
        sellerName: sellerName || user.name,
        phone: phone || user.phone || "",
        email: email || user.email,
        whatsapp,
        callTime,
        address,
        state,
        lga,
        warranty,
        warrantyDuration,
        status: "pending",
      },
    });

    await sendListingSubmittedEmail(listing.email || user.email, listing.sellerName, itemTitle);

    return res.status(201).json({ message: "Listing submitted for review.", listing });
  } catch (err) {
    console.error("Create listing error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function getListingById(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const listing = await prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if (listing.sellerId !== req.userId) {
      return res.status(403).json({ message: "You don't have access to this listing." });
    }

    return res.status(200).json({ listing });
  } catch (err) {
    console.error("Get listing by id error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function resubmitListing(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const existing = await prisma.listing.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if (existing.sellerId !== req.userId) {
      return res.status(403).json({ message: "You don't have access to this listing." });
    }

    const {
      photos, itemTitle, category, brand, model, condition, defects,
      conditionNotes, age, color, material, dimLength, dimWidth, dimHeight,
      dimWeight, description, tags, originalPrice, sellingPrice, negotiable,
      sellReason, availability, urgency, sellerName, phone, email, whatsapp,
      callTime, address, state, lga, warranty, warrantyDuration,
    } = req.body;

    const validation = validateListingPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const listing = await prisma.listing.update({
      where: { id },
      data: {
        photos: photos || [],
        itemTitle,
        category,
        brand,
        model,
        condition,
        defects: defects || [],
        conditionNotes,
        age,
        color,
        material,
        dimLength,
        dimWidth,
        dimHeight,
        dimWeight,
        description,
        tags: tags || [],
        originalPrice,
        sellingPrice,
        negotiable: negotiable ?? true,
        sellReason,
        availability,
        urgency,
        sellerName,
        phone,
        email,
        whatsapp,
        callTime,
        address,
        state,
        lga,
        warranty,
        warrantyDuration,
        status: "pending",
        rejectionReason: null,
        reviewedAt: null,
      },
    });

    await sendListingSubmittedEmail(listing.email || "", listing.sellerName, listing.itemTitle);

    return res.status(200).json({ message: "Listing resubmitted for review.", listing });
  } catch (err) {
    console.error("Resubmit listing error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function getActiveListings(_req: Request, res: Response) {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ listings });
  } catch (err) {
    console.error("Get active listings error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function getMyListings(req: AuthRequest, res: Response) {
  try {
    const listings = await prisma.listing.findMany({
      where: { sellerId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ listings });
  } catch (err) {
    console.error("Get my listings error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function getAllListings(_req: AuthRequest, res: Response) {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ listings });
  } catch (err) {
    console.error("Get all listings error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function reviewListing(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const { status, rejectionReason } = req.body;

    if (!["active", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'active' or 'rejected'." });
    }

    const listing = await prisma.listing.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === "rejected" ? rejectionReason || "" : null,
        reviewedAt: new Date(),
      },
    });

    if (status === "active") {
      const shopUrl = `${process.env.FRONTEND_URL}/product/${listing.id}`;
      await sendListingApprovedEmail(
        listing.email || "",
        listing.sellerName,
        listing.itemTitle,
        shopUrl
      );
    } else {
      const editUrl = `${process.env.FRONTEND_URL}/sell/create?edit=${listing.id}`;
      await sendListingRejectedEmail(
        listing.email || "",
        listing.sellerName,
        listing.itemTitle,
        rejectionReason || "Doesn't meet our listing guidelines.",
        editUrl
      );
    }

    return res.status(200).json({ message: `Listing marked as ${status}.`, listing });
  } catch (err) {
    console.error("Review listing error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function deleteListing(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    await prisma.listing.delete({ where: { id } });
    return res.status(200).json({ message: "Listing deleted." });
  } catch (err) {
    console.error("Delete listing error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}