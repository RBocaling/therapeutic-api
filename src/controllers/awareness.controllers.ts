import { Request, Response } from "express";
import * as campaignService from "../services/awareness.services";
import * as auditService from "../services/audit.services";

export const createCampaign = async (req: Request, res: Response) => {
  try {
    const createdById = Number(req.user?.id);
    if (!createdById) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      title,
      content,
      type,
      status,
      imageUrl,
      startDate,
      endDate,
      audienceTags,
      isAnonymous,
    } = req.body;

    const data = await campaignService.createCampaign(req?.user?.role, {
      isAnonymous,
      title,
      content,
      audienceTags,
      type,
      status,
      imageUrl,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      createdById,
    });

    await auditService.createAudit({
      description: "Successfully Campaign Posted",
      type: "CAMPAIGN_POST",
      userId: req?.user?.id,
    });
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCampaignStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const validStatuses = ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const updated = await campaignService.updateCampaignStatus(id, status);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateCampaignPostApprove = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const isPostApproved = req.body.isPostApproved;
    const updated = await campaignService.updateCampaignIsPostApproved(
      id,
      isPostApproved
    );
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listCampaigns = async (_req: Request, res: Response) => {
  try {
    const campaigns = await campaignService.listCampaigns();
    res.json(campaigns);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};
export const moderatorCampaigns = async (_req: Request, res: Response) => {
  try {
    const campaigns = await campaignService.moderatorlistCampaigns();
    res.json(campaigns);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};
export const pendingListCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await campaignService.MyPendingPendingCampaigns(
      Number(req?.user?.id)
    );
    res.json(campaigns);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};
export const counselorListCampaigns = async (_req: Request, res: Response) => {
  try {
    const campaigns = await campaignService.counselorlistCampaigns();
    res.json(campaigns);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = await campaignService.getCampaignById(id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found" });
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const payload = {
      campaignId: Number(req.params.id),
      userId: Number(req.user?.id),
      content: req.body.content,
      imageUrl: req.body.imageUrl,
    };
    await auditService.createAudit({
      description: ` Campaign Post Comment`,
      type: "POST_COMMENT",
      userId: req?.user?.id,
    });
    const data = await campaignService.addComment(payload);
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const payload = {
      campaignId: Number(req.params.id),
      userId: Number(req.user?.id),
      context: req.body.context,
      rating: req.body.rating,
      sentiment: req.body.sentiment,
      message: req.body.message,
      imageUrl: req.body.imageUrl,
    };
    const data = await campaignService.submitFeedback(payload);
    await auditService.createAudit({
      description: "Successfully Campaign Rating",
      type: "CAMPAIGN_RATE",
      userId: req?.user?.id,
    });
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listFeedbacks = async (req: Request, res: Response) => {
  try {
    const campaignId = Number(req.params.id);
    const data = await campaignService.listFeedbacks(campaignId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const body = req.body;

    const updated = await campaignService.updateCampaign(id, {
      title: body.title,
      content: body.content,
      imageUrl: body.imageUrl ?? null,
      audienceTags: body.audienceTags ?? null,
      type: body.type,
      status: body.status,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      isAnonymous: body.isAnonymous,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};