import { Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { sendIdVerifiedEmail, sendIdRejectedEmail } from "../utils/mailer";

const DEFAULT_EMAIL_NOTIFICATIONS = { orders: true, messages: true, promotions: false, newsletter: true };
const DEFAULT_PUSH_NOTIFICATIONS = { orders: true, messages: true };
const DEFAULT_SMS_NOTIFICATIONS = { orders: true, delivery: true };

function toPublicUser(user: any) {
  const { password, resetCode, resetCodeExpiry, verificationCode, ...rest } = user;
  return {
    ...rest,
    emailNotifications: rest.emailNotifications || DEFAULT_EMAIL_NOTIFICATIONS,
    pushNotifications: rest.pushNotifications || DEFAULT_PUSH_NOTIFICATIONS,
    smsNotifications: rest.smsNotifications || DEFAULT_SMS_NOTIFICATIONS,
  };
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.status(200).json({ user: toPublicUser(user) });
  } catch (err) {
    console.error("Get me error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const { name, phone, whatsapp, profileImage, address, state, lga, city } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(whatsapp !== undefined ? { whatsapp } : {}),
        ...(profileImage !== undefined ? { profileImage } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(state !== undefined ? { state } : {}),
        ...(lga !== undefined ? { lga } : {}),
        ...(city !== undefined ? { city } : {}),
      },
    });

    return res.status(200).json({ message: "Profile updated.", user: toPublicUser(user) });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function uploadIdDocument(req: AuthRequest, res: Response) {
  try {
    const { idType, idNumber, idImage } = req.body;
    if (!idType || !idNumber || !idImage) {
      return res.status(400).json({ message: "ID type, number, and document are all required." });
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        idType,
        idNumber,
        idImage,
        idVerified: false,
        idVerifiedAt: null,
        idRejectionReason: null,
        idReviewedAt: null,
      },
    });

    return res.status(200).json({ message: "ID uploaded. Verification pending.", user: toPublicUser(user) });
  } catch (err) {
    console.error("Upload ID error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function getPendingIdVerifications(_req: AuthRequest, res: Response) {
  try {
    const users = await prisma.user.findMany({
      where: { idImage: { not: null }, idVerified: false, idReviewedAt: null },
      orderBy: { updatedAt: "desc" },
    });
    return res.status(200).json({ users: users.map(toPublicUser) });
  } catch (err) {
    console.error("Get pending ID verifications error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function reviewIdVerification(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'verified' or 'rejected'." });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) return res.status(404).json({ message: "User not found." });
    if (!targetUser.idImage) return res.status(400).json({ message: "This user hasn't submitted an ID." });

    const updated = await prisma.user.update({
      where: { id },
      data: {
        idVerified: status === "verified",
        idVerifiedAt: status === "verified" ? new Date() : null,
        idRejectionReason: status === "rejected" ? rejectionReason || "Document could not be verified." : null,
        idReviewedAt: new Date(),
      },
    });

    if (status === "verified") {
      await sendIdVerifiedEmail(updated.email, updated.name);
    } else {
      const profileUrl = `${process.env.FRONTEND_URL}/dashboard/profile`;
      await sendIdRejectedEmail(
        updated.email,
        updated.name,
        rejectionReason || "Document could not be verified.",
        profileUrl
      );
    }

    return res.status(200).json({ message: `ID marked as ${status}.`, user: toPublicUser(updated) });
  } catch (err) {
    console.error("Review ID verification error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function updateBankDetails(req: AuthRequest, res: Response) {
  try {
    const { bankName, accountNumber, accountName } = req.body;
    if (!bankName || !accountNumber || !accountName) {
      return res.status(400).json({ message: "Bank name, account number, and account name are all required." });
    }
    if (!/^\d{10}$/.test(accountNumber)) {
      return res.status(400).json({ message: "Account number must be 10 digits." });
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { bankName, accountNumber, accountName, bankDetailsUpdatedAt: new Date() },
    });

    return res.status(200).json({ message: "Bank details updated.", user: toPublicUser(user) });
  } catch (err) {
    console.error("Update bank details error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function updateNotificationPreferences(req: AuthRequest, res: Response) {
  try {
    const { emailNotifications, pushNotifications, smsNotifications } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(emailNotifications !== undefined ? { emailNotifications } : {}),
        ...(pushNotifications !== undefined ? { pushNotifications } : {}),
        ...(smsNotifications !== undefined ? { smsNotifications } : {}),
      },
    });

    return res.status(200).json({ message: "Preferences updated.", user: toPublicUser(user) });
  } catch (err) {
    console.error("Update notification preferences error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function updatePreferences(req: AuthRequest, res: Response) {
  try {
    const current = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!current) return res.status(404).json({ message: "User not found." });

    const merged = { ...(current.preferences as object || {}), ...req.body };

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { preferences: merged },
    });

    return res.status(200).json({ message: "Preferences updated.", user: toPublicUser(user) });
  } catch (err) {
    console.error("Update preferences error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function deactivateAccount(req: AuthRequest, res: Response) {
  try {
    await prisma.user.update({
      where: { id: req.userId },
      data: { deactivatedAt: new Date() },
    });
    return res.status(200).json({ message: "Account deactivated." });
  } catch (err) {
    console.error("Deactivate account error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function deleteAccount(req: AuthRequest, res: Response) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Soft delete: this account has listings/orders/payouts other people depend
    // on (buyers' order history, sellers' payout records). We anonymize instead
    // of hard-deleting so those records stay intact and consistent.
    await prisma.user.update({
      where: { id: req.userId },
      data: {
        deletedAt: new Date(),
        email: `deleted+${Date.now()}_${user.email}`,
        phone: null,
        whatsapp: null,
        password: null,
        profileImage: null,
        idImage: null,
        idNumber: null,
        bankName: null,
        accountNumber: null,
        accountName: null,
      },
    });

    return res.status(200).json({ message: "Account deleted." });
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function changePassword(req: AuthRequest, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters." });
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user || !user.password) {
      return res.status(400).json({ message: "Password login isn't set up for this account." });
    }

    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashed, passwordChangedAt: new Date() },
    });

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}