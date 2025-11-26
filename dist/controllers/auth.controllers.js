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
exports.resetPassword = exports.forgotPassword = exports.changePassword = exports.updateProfilePicture = exports.getProfileProgress = exports.updateKycStatus = exports.completeProfile = exports.verifyAccount = exports.login = exports.register = exports.googleLogin = void 0;
const auth = __importStar(require("../services/auth.services"));
const auditService = __importStar(require("../services/audit.services"));
const notification_services_1 = require("../services/notification.services");
const qoutes_services_1 = require("../services/qoutes.services");
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const tokens = await auth.googleAuthService(token, res);
        await auditService.createAudit({
            description: "Login on Google",
            type: "LOGIN",
            userId: token?.id,
        });
        res.status(200).json({ message: "Google login successful", tokens });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.googleLogin = googleLogin;
const register = async (req, res) => {
    try {
        const user = await auth.registerUser(req.body);
        await auditService.createAudit({
            description: "Register",
            type: "REGISTER",
            userId: user?.id,
        });
        res.status(201).json({ message: "Registered successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const user = await auth.loginUser(req.body, res);
        await auditService.createAudit({
            description: "Login",
            type: "LOGIN",
            userId: user?.id,
        });
        res.status(200).json(user);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.login = login;
const verifyAccount = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await auth.verifyAccountService(email, otp);
        await auditService.createAudit({
            description: "Verify Account",
            type: "VERIFY_ACCOUNT",
            userId: user?.id,
        });
        res.status(200).json({ message: "Account verified successfully." });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.verifyAccount = verifyAccount;
const completeProfile = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const user = await auth.completeUserProfile(userId, req.body);
        await auditService.createAudit({
            description: "Login",
            type: "LOGIN",
            userId: userId,
        });
        res.status(200).json({ message: "Profile updated successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.completeProfile = completeProfile;
const updateKycStatus = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const user = await auth.completeUserProfile(userId, req.body);
        await auditService.createAudit({
            description: "Successfully Kyc Verified",
            type: "KYC_VERIFICATION",
            userId: userId,
        });
        if (req?.body) {
            await (0, notification_services_1.createNotification)({
                recipientId: Number(user.id),
                type: "KYC_VERIFIED",
                title: "KYC Verification Completed",
                message: `Your KYC verification has been successfully completed.`,
            });
        }
        res.status(200).json({ message: "Profile updated successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.updateKycStatus = updateKycStatus;
const getProfileProgress = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        await (0, qoutes_services_1.generateQuoteOfTheDay)(userId);
        const result = await auth.getProfileProgress(userId);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.getProfileProgress = getProfileProgress;
const updateProfilePicture = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const { profilePic } = req.body;
        await auth.updateProfilePictureService(userId, profilePic);
        await auditService.createAudit({
            description: "Successfully Updated Profile",
            type: "PROFILE_UPDATE",
            userId: userId,
        });
        res.json({
            message: "Profile picture updated successfully",
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateProfilePicture = updateProfilePicture;
// secu
const changePassword = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const { oldPassword, newPassword } = req.body;
        const result = await auth.changePassword(userId, oldPassword, newPassword);
        await auditService.createAudit({
            description: "Successfully Password Changed",
            type: "CHANGE_PASSWORD",
            userId: userId,
        });
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.changePassword = changePassword;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await auth.forgotPassword(email);
        await auditService.createAudit({
            description: "Successfully Password Changed",
            type: "CHANGE_PASSWORD",
            userId: result?.id,
        });
        res.status(200).json({ message: "OTP sent to your email." });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const result = await auth.resetPassword(email, otp, newPassword);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.resetPassword = resetPassword;
