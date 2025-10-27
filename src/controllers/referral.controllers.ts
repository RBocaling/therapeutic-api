import { Request, Response } from "express";
import * as ref from "../services/referral.services";

export const createReferralController = async (req: Request, res: Response) => {
  try {
    const referrerId = Number(req.user?.id);
    if (!referrerId) return res.status(401).json({ message: "Unauthorized" });
    
    if (req.user?.role !== "MODERATOR") {
      return res.status(201).json({ message: "Unautorized to access" });
    }
    
    const payload = {
      userId: Number(req.body.userId),
      counselorId: req.body.counselorId
        ? Number(req.body.counselorId)
        : undefined,
      referrerId,
      concern: String(req.body.concern || ""),
      shortDescription: String(req.body.shortDescription || ""),
      priority: (req.body.priority as any) || "MEDIUM",
      recipient: String(req.body.recipient || ""),
      summaryNotes: req.body.summaryNotes ?? null,
    };

    if (
      !payload.userId ||
      !payload.concern ||
      !payload.shortDescription ||
      !payload.recipient
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const referral = await ref.createReferral(payload);
    res.status(201).json({ referral });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listReferralsController = async (req: Request, res: Response) => {
  try {
    const referrals = await ref.listReferrals(Number(req?.user?.id), req?.user?.role);
    res.json(referrals);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getReferralController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const referral = await ref.getReferralById(id);
    res.json(referral );
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


export const updateReferralController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid referral id" });

    const payload = {
      counselorId: req.body.counselorId
        ? Number(req.body.counselorId)
        : undefined,
      status: req.body.status ? String(req.body.status) : undefined,
      summaryNotes: req.body.summaryNotes ?? undefined,
      priority: req.body.priority ? String(req.body.priority) : undefined,
      recipient: req.body.recipient ? String(req.body.recipient) : undefined,
    };

    const referral = await ref.updateReferral(
      id,
      payload as any,
      Number(req.user?.id)
    );
    res.json({ referral });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteReferralController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const result = await ref.deleteReferral(id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
