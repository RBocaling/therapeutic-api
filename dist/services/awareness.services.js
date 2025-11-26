"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContentPost = exports.updateCampaign = exports.listFeedbacks = exports.submitFeedback = exports.addComment = exports.getCampaignById = exports.counselorlistCampaigns = exports.MyPendingPendingCampaigns = exports.moderatorlistCampaigns = exports.getMyPost = exports.listCampaignsAll = exports.listCampaigns = exports.updateCampaignIsPostApproved = exports.updateCampaignStatus = exports.createCampaign = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createCampaign = async (role, data) => {
    try {
        if (data.type === "EVENT" && !data.startDate) {
            throw new Error("Start date is required for event campaigns.");
        }
        return await prisma_1.default.awarenessCampaign.create({
            data: {
                isAnonymous: data?.isAnonymous,
                title: data.title,
                content: data.content,
                type: data.type,
                status: data.status ?? "DRAFT",
                imageUrl: data.imageUrl ?? null,
                startDate: data.startDate ?? null,
                endDate: data.endDate ?? null,
                audienceTags: data.audienceTags ?? null,
                createdById: data.createdById,
                isPostApproved: role === "MODERATOR" ? true : false,
                images: data.images
                    ? {
                        create: data.images.map((i) => ({
                            url: i.url,
                            altText: i.altText ?? null,
                        })),
                    }
                    : undefined,
            },
            include: {
                images: true,
            },
        });
    }
    catch (error) {
        throw new Error(`Failed to create campaign: ${error}`);
    }
};
exports.createCampaign = createCampaign;
const updateCampaignStatus = async (id, status) => {
    try {
        return await prisma_1.default.awarenessCampaign.update({
            where: { id },
            data: { status },
        });
    }
    catch (error) {
        throw new Error(`Failed to update campaign status: ${error}`);
    }
};
exports.updateCampaignStatus = updateCampaignStatus;
const updateCampaignIsPostApproved = async (id, isPostApproved) => {
    try {
        return await prisma_1.default.awarenessCampaign.update({
            where: { id },
            data: { isPostApproved },
        });
    }
    catch (error) {
        throw new Error(`Failed to update campaign status: ${error}`);
    }
};
exports.updateCampaignIsPostApproved = updateCampaignIsPostApproved;
const listCampaigns = async () => {
    try {
        const response = await prisma_1.default.awarenessCampaign.findMany({
            where: { isPostApproved: true, isDeleted: false },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePic: true,
                        role: true,
                    },
                },
                images: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                                suffix: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },
                feedbacks: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                                suffix: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return response?.map((item) => ({
            ...item,
            createdBy: item?.isAnonymous ? "Anonymous" : item?.createdBy,
        }));
    }
    catch (error) {
        throw new Error(`Failed to fetch campaigns: ${error}`);
    }
};
exports.listCampaigns = listCampaigns;
const listCampaignsAll = async () => {
    try {
        const response = await prisma_1.default.awarenessCampaign.findMany({
            where: { isDeleted: false },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePic: true,
                        role: true,
                    },
                },
                images: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                                suffix: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },
                feedbacks: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                                suffix: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return response?.map((item) => ({
            ...item,
            createdBy: item?.isAnonymous ? "Anonymous" : item?.createdBy,
            createdByRole: item?.createdBy?.role,
        }));
    }
    catch (error) {
        throw new Error(`Failed to fetch campaigns: ${error}`);
    }
};
exports.listCampaignsAll = listCampaignsAll;
const getMyPost = async (id) => {
    try {
        const response = await prisma_1.default.awarenessCampaign.findMany({
            where: { isDeleted: false, createdById: id },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePic: true,
                        role: true,
                    },
                },
                images: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                                suffix: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },
                feedbacks: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                                suffix: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return response?.map((item) => ({
            ...item,
            createdBy: item?.isAnonymous ? "Anonymous" : item?.createdBy,
        }));
    }
    catch (error) {
        throw new Error(`Failed to fetch campaigns: ${error}`);
    }
};
exports.getMyPost = getMyPost;
const moderatorlistCampaigns = async () => {
    try {
        const response = await prisma_1.default.awarenessCampaign.findMany({
            where: { isDeleted: false },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePic: true,
                        role: true,
                    },
                },
                images: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                                suffix: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },
                feedbacks: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                                suffix: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return response
            ?.filter((item) => item?.createdBy?.role === "MODERATOR" ||
            item?.createdBy?.role === "COUNSELOR")
            ?.map((item) => ({
            ...item,
            createdBy: item?.isAnonymous ? "Anonymous" : item?.createdBy,
        }));
    }
    catch (error) {
        throw new Error(`Failed to fetch campaigns: ${error}`);
    }
};
exports.moderatorlistCampaigns = moderatorlistCampaigns;
const MyPendingPendingCampaigns = async (id) => {
    try {
        const response = await prisma_1.default.awarenessCampaign.findMany({
            where: { isPostApproved: false, createdById: id, isDeleted: false },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePic: true,
                        role: true,
                    },
                },
                images: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                                suffix: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },
                feedbacks: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                                suffix: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return response?.map((item) => ({
            ...item,
            createdBy: item?.isAnonymous ? "Anonymous" : item?.createdBy,
        }));
    }
    catch (error) {
        throw new Error(`Failed to fetch campaigns: ${error}`);
    }
};
exports.MyPendingPendingCampaigns = MyPendingPendingCampaigns;
const counselorlistCampaigns = async () => {
    try {
        const response = await prisma_1.default.awarenessCampaign.findMany({
            where: { isPostApproved: false, isDeleted: false },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePic: true,
                        role: true,
                    },
                },
                images: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                                suffix: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },
                feedbacks: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                                suffix: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return response?.map((item) => ({
            ...item,
            createdBy: item?.isAnonymous ? "Anonymous" : item?.createdBy,
        }));
    }
    catch (error) {
        throw new Error(`Failed to fetch campaigns: ${error}`);
    }
};
exports.counselorlistCampaigns = counselorlistCampaigns;
const getCampaignById = async (id) => {
    try {
        return await prisma_1.default.awarenessCampaign.findUnique({
            where: { id, isDeleted: false },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePic: true,
                        email: true,
                    },
                },
                images: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                                suffix: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },
                feedbacks: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                                suffix: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },
            },
        });
    }
    catch (error) {
        throw new Error(`Failed to fetch campaign details: ${error}`);
    }
};
exports.getCampaignById = getCampaignById;
const addComment = async (payload) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user)
            throw new Error("User not found");
        // if (user.role !== "USER")
        //   throw new Error("Only students/employees can comment");
        const campaign = await prisma_1.default.awarenessCampaign.findUnique({
            where: { id: payload.campaignId },
        });
        if (!campaign)
            throw new Error("Campaign not found");
        return await prisma_1.default.comment.create({
            data: {
                content: payload.content,
                imageUrl: payload.imageUrl ?? null,
                userId: payload.userId,
                campaignId: payload.campaignId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePic: true,
                    },
                },
            },
        });
    }
    catch (error) {
        throw new Error(`Failed to add comment: ${error}`);
    }
};
exports.addComment = addComment;
const submitFeedback = async (payload) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user)
            throw new Error("User not found");
        if (user.role !== "USER")
            throw new Error("Only students/employees can send feedback");
        const campaign = await prisma_1.default.awarenessCampaign.findUnique({
            where: { id: payload.campaignId },
        });
        if (!campaign)
            throw new Error("Campaign not found");
        return await prisma_1.default.feedback.create({
            data: {
                userId: payload.userId,
                campaignId: payload.campaignId,
                context: payload.context ?? null,
                rating: payload.rating ?? null,
                sentiment: payload.sentiment ?? null,
                message: payload.message,
                imageUrl: payload.imageUrl ?? null,
            },
            include: {
                user: { select: { id: true, firstName: true, lastName: true } },
                campaign: { select: { id: true, title: true, type: true } },
            },
        });
    }
    catch (error) {
        throw new Error(`Failed to submit feedback: ${error}`);
    }
};
exports.submitFeedback = submitFeedback;
const listFeedbacks = async (campaignId) => {
    try {
        const where = campaignId ? { campaignId } : undefined;
        return await prisma_1.default.feedback.findMany({
            where,
            include: {
                user: { select: { id: true, firstName: true, lastName: true } },
                campaign: { select: { id: true, title: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    catch (error) {
        throw new Error(`Failed to fetch feedbacks: ${error}`);
    }
};
exports.listFeedbacks = listFeedbacks;
const updateCampaign = async (id, data) => {
    try {
        const campaign = await prisma_1.default.awarenessCampaign.findUnique({
            where: { id },
        });
        if (!campaign)
            throw new Error("Campaign not found");
        return await prisma_1.default.awarenessCampaign.update({
            where: { id },
            data: {
                title: data.title ?? campaign.title,
                content: data.content ?? campaign.content,
                imageUrl: data.imageUrl ?? campaign.imageUrl,
                audienceTags: data.audienceTags ?? campaign.audienceTags,
                type: data.type ?? campaign.type,
                status: data.status ?? campaign.status,
                startDate: data.startDate ?? campaign.startDate,
                endDate: data.endDate ?? campaign.endDate,
                isAnonymous: data.isAnonymous ?? campaign.isAnonymous,
                images: data.images
                    ? {
                        deleteMany: {},
                        create: data.images.map((i) => ({
                            url: i.url,
                            altText: i.altText ?? null,
                        })),
                    }
                    : undefined,
            },
            include: {
                images: true,
            },
        });
    }
    catch (error) {
        throw new Error(`Failed to update campaign: ${error}`);
    }
};
exports.updateCampaign = updateCampaign;
const deleteContentPost = async (id) => {
    try {
        const campaign = await prisma_1.default.awarenessCampaign.findUnique({
            where: { id },
        });
        if (!campaign)
            throw new Error("Campaign not found");
        return await prisma_1.default.awarenessCampaign.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });
    }
    catch (error) {
        throw new Error(`Failed to fetch feedbacks: ${error}`);
    }
};
exports.deleteContentPost = deleteContentPost;
