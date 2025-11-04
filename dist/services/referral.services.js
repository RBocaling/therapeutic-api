"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReferral = exports.updateReferral = exports.getReferralById = exports.listReferrals = exports.createReferral = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const notification_services_1 = require("./notification.services");
const createReferral = async (payload) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user)
            throw new Error("User not found");
        if (payload.counselorId) {
            const counselor = await prisma_1.default.user.findUnique({
                where: { id: payload.counselorId },
            });
            if (!counselor)
                throw new Error("Counselor not found");
        }
        const referrer = await prisma_1.default.user.findUnique({
            where: { id: payload.referrerId },
        });
        if (!referrer)
            throw new Error("Referrer not found");
        if (payload.counselorId) {
            const existingReferral = await prisma_1.default.referral.findFirst({
                where: {
                    userId: payload.userId,
                    counselorId: payload.counselorId,
                    status: { in: ["SENT", "ACCEPTED", "PENDING"] }, // active referrals only
                },
            });
            if (existingReferral) {
                throw new Error("This user is already referred to the same counselor. Duplicate referrals are not allowed.");
            }
        }
        const referral = await prisma_1.default.referral.create({
            data: {
                userId: payload.userId,
                counselorId: payload.counselorId ?? null,
                referrerId: payload.referrerId,
                concern: payload.concern,
                shortDescription: payload.shortDescription,
                priority: payload.priority,
                recipient: payload.recipient,
                summaryNotes: payload.summaryNotes ?? null,
            },
            include: {
                user: {
                    select: { id: true, firstName: true, lastName: true, email: true },
                },
                counselor: {
                    select: { id: true, firstName: true, lastName: true, email: true },
                },
                referrer: {
                    select: { id: true, firstName: true, lastName: true, email: true },
                },
            },
        });
        if (referral.counselorId) {
            await (0, notification_services_1.createNotification)({
                recipientId: referral.counselorId,
                type: "REFERRAL",
                title: "New Referral Assigned",
                message: `You have been assigned a referral for ${referral.user.firstName} ${referral.user.lastName}.`,
            });
        }
        await (0, notification_services_1.createNotification)({
            recipientId: referral.referrerId,
            type: "REFERRAL",
            title: "Referral Sent",
            message: `Referral for ${referral.user.firstName} ${referral.user.lastName} has been created.`,
        });
        return referral;
    }
    catch (error) {
        throw new Error(error.message || "Failed to create referral");
    }
};
exports.createReferral = createReferral;
const listReferrals = async (id, role) => {
    const where = {};
    if (role === "USER")
        where.userId = id;
    if (role === "COUNSELOR")
        where.counselorId = id;
    if (role === "REFERRER")
        where.referrerId = id;
    try {
        const referrals = await prisma_1.default.referral.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        profilePic: true,
                        isAccountVerified: true,
                    },
                },
                counselor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        profilePic: true,
                    },
                },
                referrer: {
                    select: { id: true, firstName: true, lastName: true, email: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return referrals;
    }
    catch (error) {
        throw new Error(error.message || "Failed to list referrals");
    }
};
exports.listReferrals = listReferrals;
const getReferralById = async (id) => {
    try {
        const referral = await prisma_1.default.referral.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        profilePic: true,
                    },
                },
                counselor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        profilePic: true,
                    },
                },
                referrer: {
                    select: { id: true, firstName: true, lastName: true, email: true },
                },
            },
        });
        if (!referral)
            throw new Error("Referral not found");
        return referral;
    }
    catch (error) {
        throw new Error(error.message || "Failed to get referral");
    }
};
exports.getReferralById = getReferralById;
const updateReferral = async (id, data, actorId) => {
    if (data.counselorId) {
        const counselor = await prisma_1.default.user.findUnique({
            where: { id: data.counselorId },
        });
        if (!counselor)
            throw new Error("Counselor not found");
    }
    const referral = await prisma_1.default.referral.update({
        where: { id },
        data: {
            counselorId: data.counselorId ?? undefined,
            status: data.status ?? undefined,
            summaryNotes: data.summaryNotes ?? undefined,
            priority: data.priority ?? undefined,
            recipient: data.recipient ?? undefined,
        },
        include: {
            user: true,
            counselor: true,
            referrer: true,
        },
    });
    if (data.status) {
        await prisma_1.default.notification.create({
            data: {
                recipientId: referral.referrerId,
                type: "ACTIVITY_PROGRESS",
                title: `Referral ${data.status}`,
                message: `Referral for ${referral.user.firstName} ${referral.user.lastName} is now ${data.status}.`,
            },
        });
    }
    if (data.counselorId) {
        await prisma_1.default.notification.create({
            data: {
                recipientId: Number(data.counselorId),
                type: "REFERRAL",
                title: "Referral Assigned",
                message: `You were assigned referral for ${referral.user.firstName} ${referral.user.lastName}.`,
            },
        });
    }
    return referral;
};
exports.updateReferral = updateReferral;
const deleteReferral = async (id) => {
    try {
        await prisma_1.default.referral.delete({ where: { id } });
        return { success: true };
    }
    catch (error) {
        throw new Error(error.message || "Failed to delete referral");
    }
};
exports.deleteReferral = deleteReferral;
