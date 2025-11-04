"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCounselor = exports.addModerator = exports.addAdmin = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const argon2_1 = __importDefault(require("argon2"));
const addAdmin = async (data) => {
    try {
        const { email, password } = data;
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing)
            throw new Error("Email already registered.");
        const hashedPassword = await argon2_1.default.hash(password);
        const admin = await prisma_1.default.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                middleName: data.middleName,
                email,
                password: hashedPassword,
                role: "ADMIN",
                profilePic: data.profilePic ?? null,
            },
        });
        return admin;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.addAdmin = addAdmin;
const addModerator = async (data) => {
    try {
        const { email, password } = data;
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing)
            throw new Error("Email already registered.");
        const hashedPassword = await argon2_1.default.hash(password);
        const moderator = await prisma_1.default.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                middleName: data.middleName,
                email,
                password: hashedPassword,
                role: "MODERATOR",
                profilePic: data.profilePic ?? null,
            },
        });
        return moderator;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.addModerator = addModerator;
const addCounselor = async (data) => {
    try {
        const { email, password } = data;
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing)
            throw new Error("Email already registered.");
        const hashedPassword = await argon2_1.default.hash(password);
        const result = await prisma_1.default.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    middleName: data.middleName,
                    email,
                    password: hashedPassword,
                    role: "COUNSELOR",
                    profilePic: data.profilePic ?? null,
                },
            });
            const counselorProfile = await tx.counselorProfile.create({
                data: {
                    userId: user.id,
                    licenseNumber: data.licenseNumber ?? null,
                    specialization: data.specialization ?? null,
                    experienceYears: data.experienceYears ?? 0,
                },
            });
            return { ...user, counselorProfile };
        });
        return result;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.addCounselor = addCounselor;
