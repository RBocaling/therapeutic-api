"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicketStatus = exports.listSupportTickets = exports.getSupportTicket = exports.addSupportResponse = exports.createSupportTicket = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createSupportTicket = async (data) => {
    try {
        const user = await prisma_1.default.user.findUnique({ where: { id: data.userId } });
        if (!user)
            throw new Error("User not found");
        return await prisma_1.default.contactSupport.create({
            data: {
                userId: data.userId,
                subject: data.subject,
                message: data.message,
                imageUrl: data.imageUrl ?? null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    catch (error) {
        throw new Error(`Failed to create support ticket: ${error.message}`);
    }
};
exports.createSupportTicket = createSupportTicket;
const addSupportResponse = async (data) => {
    try {
        const ticket = await prisma_1.default.contactSupport.findUnique({
            where: { id: data.contactSupportId },
        });
        if (!ticket)
            throw new Error("Support ticket not found");
        return await prisma_1.default.supportResponse.create({
            data: {
                contactSupportId: data.contactSupportId,
                responderId: data.responderId,
                message: data.message,
                imageUrl: data.imageUrl ?? null,
            },
            include: {
                responder: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        profilePic: true,
                    },
                },
            },
        });
    }
    catch (error) {
        throw new Error(`Failed to send response: ${error.message}`);
    }
};
exports.addSupportResponse = addSupportResponse;
const getSupportTicket = async (id) => {
    try {
        return await prisma_1.default.contactSupport.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
                responses: {
                    include: {
                        responder: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                role: true,
                                profilePic: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "asc" },
                },
            },
        });
    }
    catch (error) {
        throw new Error(`Failed to fetch ticket: ${error.message}`);
    }
};
exports.getSupportTicket = getSupportTicket;
const listSupportTickets = async (role, userId) => {
    try {
        const where = role === "ADMIN"
            ? {}
            : {
                userId,
            };
        return await prisma_1.default.contactSupport.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
                responses: {
                    take: 1,
                    orderBy: { createdAt: "desc" },
                    select: { message: true, createdAt: true },
                },
            },
            orderBy: { updatedAt: "desc" },
        });
    }
    catch (error) {
        throw new Error(`Failed to list support tickets: ${error.message}`);
    }
};
exports.listSupportTickets = listSupportTickets;
const updateTicketStatus = async (id, status) => {
    try {
        return await prisma_1.default.contactSupport.update({
            where: { id },
            data: { status },
        });
    }
    catch (error) {
        throw new Error(`Failed to update status: ${error.message}`);
    }
};
exports.updateTicketStatus = updateTicketStatus;
