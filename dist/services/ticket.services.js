"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicketStatus = exports.getAllTickets = exports.getUserTickets = exports.createTicket = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createTicket = async (data) => {
    try {
        return prisma_1.default.supportTicket.create({
            data: {
                userId: data.userId,
                description: data.description,
                imageUrl: data.imageUrl,
            },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.createTicket = createTicket;
const getUserTickets = async (userId) => {
    try {
        return prisma_1.default.supportTicket.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getUserTickets = getUserTickets;
const getAllTickets = async () => {
    try {
        return prisma_1.default.supportTicket.findMany({
            include: {
                user: {
                    select: { id: true, firstName: true, lastName: true, email: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getAllTickets = getAllTickets;
const updateTicketStatus = async (id, status) => {
    try {
        return prisma_1.default.supportTicket.update({
            where: { id },
            data: { status },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.updateTicketStatus = updateTicketStatus;
