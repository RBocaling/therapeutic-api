"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.listUsers = exports.getUserUserInfo = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getUserUserInfo = async (userId) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                role: true,
                suffix: true,
                email: true,
                profilePic: true,
                isTakeSurvey: true,
                profile: true,
            },
        });
        if (!user)
            throw new Error("User not found.");
        return {
            id: user.id,
            name: `${user.firstName} ${user.middleName ?? ""} ${user.lastName} ${user.suffix ?? ""}`.trim(),
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            isTakeSurvey: user.isTakeSurvey,
            profile: user.profile,
        };
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getUserUserInfo = getUserUserInfo;
const listUsers = async () => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isAccountVerified: true,
                profilePic: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return users;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.listUsers = listUsers;
const getUserById = async (id) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id },
            include: {
                profile: true,
                counselorInfo: true,
            },
        });
        if (!user)
            throw new Error("User not found");
        return user;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getUserById = getUserById;
