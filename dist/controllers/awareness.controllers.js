"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContentPost = exports.updateCampaign = exports.listFeedbacks = exports.submitFeedback = exports.addComment = exports.getCampaignById = exports.counselorListCampaigns = exports.UserspendingListCampaigns = exports.pendingListCampaigns = exports.moderatorCampaigns = exports.getMyPost = exports.listCampaignsV3 = exports.listCampaignsAll = exports.listCampaigns = exports.updateCampaignPostApprove = exports.updateCampaignStatus = exports.createCampaign = void 0;
const campaignService = __importStar(require("../services/awareness.services"));
const auditService = __importStar(require("../services/audit.services"));
const createCampaign = async (req, res) => {
    try {
        const createdById = Number(req.user?.id);
        if (!createdById) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { title, content, type, status, imageUrl, images, startDate, endDate, audienceTags, isAnonymous, } = req.body;
        const data = await campaignService.createCampaign(req?.user?.role, {
            isAnonymous,
            title,
            content,
            audienceTags,
            type,
            status,
            imageUrl,
            images,
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createCampaign = createCampaign;
const updateCampaignStatus = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateCampaignStatus = updateCampaignStatus;
const updateCampaignPostApprove = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const isPostApproved = req.body.isPostApproved;
        const updated = await campaignService.updateCampaignIsPostApproved(id, isPostApproved);
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateCampaignPostApprove = updateCampaignPostApprove;
const listCampaigns = async (_req, res) => {
    try {
        const campaigns = await campaignService.listCampaigns();
        res.json(campaigns);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
};
exports.listCampaigns = listCampaigns;
const listCampaignsAll = async (_req, res) => {
    try {
        const campaigns = await campaignService.listCampaignsAll();
        res.json(campaigns);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
};
exports.listCampaignsAll = listCampaignsAll;
const listCampaignsV3 = async (_req, res) => {
    try {
        const campaigns = await campaignService.listCampaignsAllV3();
        res.json(campaigns);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
};
exports.listCampaignsV3 = listCampaignsV3;
const getMyPost = async (req, res) => {
    try {
        const campaigns = await campaignService.getMyPost(Number(req?.user?.id));
        res.json(campaigns);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
};
exports.getMyPost = getMyPost;
const moderatorCampaigns = async (_req, res) => {
    try {
        const campaigns = await campaignService.moderatorlistCampaigns();
        res.json(campaigns);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
};
exports.moderatorCampaigns = moderatorCampaigns;
const pendingListCampaigns = async (req, res) => {
    try {
        const campaigns = await campaignService.MyPendingPendingCampaigns(Number(req?.user?.id));
        res.json(campaigns);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
};
exports.pendingListCampaigns = pendingListCampaigns;
const UserspendingListCampaigns = async (req, res) => {
    try {
        const campaigns = await campaignService.UserPendingPendingCampaigns(Number(req?.user?.id));
        res.json(campaigns);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
};
exports.UserspendingListCampaigns = UserspendingListCampaigns;
const counselorListCampaigns = async (_req, res) => {
    try {
        const campaigns = await campaignService.counselorlistCampaigns();
        res.json(campaigns);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
};
exports.counselorListCampaigns = counselorListCampaigns;
const getCampaignById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = await campaignService.getCampaignById(id);
        if (!data)
            return res
                .status(404)
                .json({ success: false, message: "Campaign not found" });
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCampaignById = getCampaignById;
const addComment = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.addComment = addComment;
const submitFeedback = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.submitFeedback = submitFeedback;
const listFeedbacks = async (req, res) => {
    try {
        const campaignId = Number(req.params.id);
        const data = await campaignService.listFeedbacks(campaignId);
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.listFeedbacks = listFeedbacks;
const updateCampaign = async (req, res) => {
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
            images: body.images,
        });
        res.status(200).json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateCampaign = updateCampaign;
const deleteContentPost = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updated = await campaignService.deleteContentPost(id);
        res.status(200).json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteContentPost = deleteContentPost;
