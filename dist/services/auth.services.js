"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.changePassword = exports.updateProfilePictureService = exports.getProfileProgress = exports.completeUserProfile = exports.verifyAccountService = exports.loginUser = exports.registerUser = exports.googleAuthService = void 0;
const argon2_1 = __importDefault(require("argon2"));
const prisma_1 = __importDefault(require("../config/prisma"));
const mailer_1 = require("../utils/mailer");
const otp_1 = require("../utils/otp");
const jwt_1 = require("../utils/jwt");
const notification_services_1 = require("./notification.services");
const googleClient_1 = require("../utils/googleClient");
// connect google
const googleAuthService = async (token, res) => {
    try {
        let googleUser;
        if (token.startsWith("ya29.")) {
            const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${token}` },
            });
            googleUser = await response.json();
            if (!googleUser?.email)
                throw new Error("Invalid Google access token.");
        }
        else {
            googleUser = await (0, googleClient_1.verifyGoogleToken)(token);
            if (!googleUser?.email)
                throw new Error("Invalid Google ID token.");
        }
        let user = await prisma_1.default.user.findUnique({
            where: { email: googleUser.email },
        });
        if (!user) {
            user = await prisma_1.default.user.create({
                data: {
                    firstName: googleUser.given_name ?? "",
                    lastName: googleUser.family_name ?? "",
                    email: googleUser.email,
                    isAccountVerified: true,
                    googleId: googleUser.sub,
                    profile: { create: { userStatus: "STUDENT" } },
                },
            });
        }
        else if (!user.googleId) {
            await prisma_1.default.user.update({
                where: { id: user.id },
                data: { googleId: googleUser.sub },
            });
        }
        const tokens = (0, jwt_1.generateTokens)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        return user;
    }
    catch (error) {
        throw new Error(error.message || "Google authentication failed.");
    }
};
exports.googleAuthService = googleAuthService;
// manualll
const registerUser = async (data) => {
    try {
        const existing = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existing)
            throw new Error("Email already registered.");
        const hashedPassword = await argon2_1.default.hash(data.password);
        const otp = (0, otp_1.generateOtp)();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        const user = await prisma_1.default.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    middleName: data.middleName ?? null,
                    suffix: data.suffix ?? null,
                    email: data.email,
                    password: hashedPassword,
                    profile: { create: { userStatus: data.userStatus ?? "STUDENT" } },
                    otpCode: otp,
                    otpExpiresAt: expiresAt,
                },
                include: { profile: true },
            });
            await (0, mailer_1.sendMail)(data.email, "Verify your Account", `<h3>Welcome, ${data.firstName}!</h3>
         <p>Your OTP is:</p>
         <h2 style="color:#4CAF50;">${otp}</h2>
         <p>Expires in 10 minutes.</p>`);
            return newUser;
        });
        return user;
    }
    catch (err) {
        throw new Error(err.message || "Registration failed.");
    }
};
exports.registerUser = registerUser;
const loginUser = async ({ email, password }, res) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { email },
            select: {
                id: true,
                password: true,
                role: true,
                isAccountVerified: true,
                profile: { select: { id: true } },
            },
        });
        if (!user?.password || !user)
            throw new Error("User not found.");
        const valid = await argon2_1.default.verify(user?.password, password);
        if (!valid)
            throw new Error("Invalid credentials.");
        if (user.role === "USER" && !user.isAccountVerified)
            throw new Error("Account not verified.");
        const tokens = (0, jwt_1.generateTokens)(user);
        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        return user;
    }
    catch (err) {
        throw new Error(err.message || "Login failed.");
    }
};
exports.loginUser = loginUser;
const verifyAccountService = async (email, otp) => {
    try {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            throw new Error("User not found.");
        if (user.isAccountVerified)
            throw new Error("Account already verified.");
        if (user.otpCode !== otp)
            throw new Error("Invalid OTP.");
        if (user.otpExpiresAt && user.otpExpiresAt < new Date())
            throw new Error("OTP expired.");
        const data = await prisma_1.default.user.update({
            where: { email },
            data: { isAccountVerified: true, otpCode: null, otpExpiresAt: null },
        });
        await (0, notification_services_1.createNotification)({
            recipientId: Number(user.id),
            type: "ACCOUNT_VERIFIED",
            title: "Account Verified Successfully",
            message: `Hi ${user.firstName}, your account has been verified. `,
        });
        return data;
    }
    catch (err) {
        throw new Error(err.message || "Verification failed.");
    }
};
exports.verifyAccountService = verifyAccountService;
const completeUserProfile = async (userId, data) => {
    try {
        return await prisma_1.default.userProfile.update({
            where: { userId },
            data: {
                gender: data.gender ?? undefined,
                birthday: data.birthday ? new Date(data.birthday) : undefined,
                country: data.country ?? undefined,
                province: data.province ?? undefined,
                municipality: data.municipality ?? undefined,
                barangay: data.barangay ?? undefined,
                contactNo: data.contactNo ?? undefined,
                guardianName: data.guardianName ?? undefined,
                guardianContact: data.guardianContact ?? undefined,
                userStatus: data.userStatus ?? undefined,
                validId: data.validId ?? undefined,
                selfieImage: data.selfieImage ?? undefined,
                isFirstGenerationStudent: data.isFirstGenerationStudent ?? undefined,
                employeeOffice: data.employeeOffice ?? undefined,
                employeeUnit: data.employeeUnit ?? undefined,
                indigenousGroup: data.indigenousGroup ?? undefined,
                isSingleParent: data.isSingleParent ?? undefined,
                singleParentYears: data.singleParentYears ?? undefined,
                isPWD: data.isPWD ?? undefined,
                disability: data.disability ?? undefined,
                familyIncomeRange: data.familyIncomeRange ?? undefined,
                school: data.school ?? undefined,
                course: data.course ?? undefined,
                yearLevel: data.yearLevel ?? undefined,
                sectionBlock: data.sectionBlock ?? undefined,
                office: data.office ?? undefined,
                jobPosition: data.jobPosition ?? undefined,
                isKycVerified: data.isKycVerified ?? undefined,
            },
        });
    }
    catch (err) {
        throw new Error(err.message || "Profile update failed.");
    }
};
exports.completeUserProfile = completeUserProfile;
const getProfileProgress = async (userId) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
        if (!user || !user.profile)
            throw new Error("Profile not found");
        const profile = user.profile;
        const personalFields = [
            "gender",
            "birthday",
            "country",
            "province",
            "municipality",
            "barangay",
            "contactNo",
            "guardianName",
            "guardianContact",
            "userStatus",
            "validId",
            "selfieImage",
        ];
        const filledFields = personalFields.filter((f) => profile[f] !== null &&
            profile[f] !== undefined &&
            profile[f] !== "");
        const personalInfoComplete = filledFields.length / personalFields.length >= 0.8;
        const profilePictureComplete = !!user.profilePic;
        const kycComplete = !!profile.isKycVerified;
        let progress = 0;
        if (personalInfoComplete)
            progress += 50;
        if (profilePictureComplete)
            progress += 20;
        if (kycComplete)
            progress += 30;
        const summary = {
            personalInfo: personalInfoComplete,
            profilePicture: profilePictureComplete,
            kycVerification: kycComplete,
        };
        return { progress, summary };
    }
    catch (error) {
        throw new Error(error.message || "Failed to get profile progress.");
    }
};
exports.getProfileProgress = getProfileProgress;
const updateProfilePictureService = async (userId, profilePic) => {
    try {
        if (!profilePic)
            throw new Error("Profile picture is required");
        const updated = await prisma_1.default.user.update({
            where: { id: userId },
            data: { profilePic },
        });
        return updated;
    }
    catch (error) {
        throw new Error(error.message || "Failed to upload profile.");
    }
};
exports.updateProfilePictureService = updateProfilePictureService;
// SECURITY
const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user || !user?.password || !user?.email)
            throw new Error("User not found.");
        const valid = await argon2_1.default.verify(user.password, oldPassword);
        if (!valid)
            throw new Error("Old password is incorrect.");
        const hashed = await argon2_1.default.hash(newPassword);
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { password: hashed },
        });
        await (0, mailer_1.sendMail)(user.email, "Your Password Has Been Changed", `<p>Hello ${user.firstName},</p>
     <p>Your account password has been successfully changed. If you did not perform this action, please contact support immediately.</p>`);
        return { message: "Password changed successfully." };
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.changePassword = changePassword;
const forgotPassword = async (email) => {
    try {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            throw new Error("User not found.");
        const otp = (0, otp_1.generateOtp)();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await prisma_1.default.user.update({
            where: { email },
            data: { otpCode: otp, otpExpiresAt: expiresAt },
        });
        await (0, mailer_1.sendMail)(email, "Reset Your Password", `<p>Hello ${user.firstName},</p>
     <p>Your password reset OTP is:</p>
     <h2 style="color:#4CAF50;">${otp}</h2>
     <p>Expires in 10 minutes.</p>`);
        return user;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (email, otp, newPassword) => {
    try {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            throw new Error("User not found.");
        if (user.otpCode !== otp)
            throw new Error("Invalid OTP.");
        if (user.otpExpiresAt && user.otpExpiresAt < new Date())
            throw new Error("OTP expired.");
        const hashed = await argon2_1.default.hash(newPassword);
        await prisma_1.default.user.update({
            where: { email },
            data: { password: hashed, otpCode: null, otpExpiresAt: null },
        });
        await (0, mailer_1.sendMail)(email, "Your Password Has Been Reset", `<p>Hello ${user.firstName},</p>
     <p>Your account password has been successfully reset. If you did not perform this action, please contact support immediately.</p>`);
        return { message: "Password reset successfully." };
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.resetPassword = resetPassword;
