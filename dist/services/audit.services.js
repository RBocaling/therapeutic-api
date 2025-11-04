"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAudits = exports.getAllAudits = exports.createAudit = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createAudit = async (data) => {
    try {
        return prisma_1.default.auditTrail.create({
            data: {
                userId: data.userId,
                type: data.type,
                description: data.description,
            },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.createAudit = createAudit;
const getAllAudits = async () => {
    try {
        return prisma_1.default.auditTrail.findMany({
            include: {
                user: {
                    select: { id: true, firstName: true, lastName: true, role: true, profilePic: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getAllAudits = getAllAudits;
const getUserAudits = async (userId) => {
    try {
        return prisma_1.default.auditTrail.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getUserAudits = getUserAudits;
