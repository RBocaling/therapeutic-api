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
exports.deleteReferralController = exports.updateReferralController = exports.getReferralController = exports.listReferralsController = exports.createReferralController = void 0;
const ref = __importStar(require("../services/referral.services"));
const createReferralController = async (req, res) => {
    try {
        const referrerId = Number(req.user?.id);
        if (!referrerId)
            return res.status(401).json({ message: "Unauthorized" });
        if (req.user?.role !== "MODERATOR") {
            return res.status(201).json({ message: "Unautorized to access" });
        }
        const payload = {
            userId: Number(req.body.userId),
            counselorId: req.body.counselorId
                ? Number(req.body.counselorId)
                : undefined,
            referrerId,
            concern: String(req.body.concern || ""),
            shortDescription: String(req.body.shortDescription || ""),
            priority: req.body.priority || "MEDIUM",
            recipient: String(req.body.recipient || ""),
            summaryNotes: req.body.summaryNotes ?? null,
        };
        if (!payload.userId ||
            !payload.concern ||
            !payload.shortDescription ||
            !payload.recipient) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const referral = await ref.createReferral(payload);
        res.status(201).json({ referral });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.createReferralController = createReferralController;
const listReferralsController = async (req, res) => {
    try {
        const referrals = await ref.listReferrals(Number(req?.user?.id), req?.user?.role);
        res.json(referrals);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.listReferralsController = listReferralsController;
const getReferralController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: "Invalid id" });
        const referral = await ref.getReferralById(id);
        res.json(referral);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.getReferralController = getReferralController;
const updateReferralController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: "Invalid referral id" });
        const payload = {
            counselorId: req.body.counselorId
                ? Number(req.body.counselorId)
                : undefined,
            status: req.body.status ? String(req.body.status) : undefined,
            summaryNotes: req.body.summaryNotes ?? undefined,
            priority: req.body.priority ? String(req.body.priority) : undefined,
            recipient: req.body.recipient ? String(req.body.recipient) : undefined,
        };
        const referral = await ref.updateReferral(id, payload, Number(req.user?.id));
        res.json({ referral });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.updateReferralController = updateReferralController;
const deleteReferralController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: "Invalid id" });
        const result = await ref.deleteReferral(id);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.deleteReferralController = deleteReferralController;
