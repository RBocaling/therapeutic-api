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
exports.updateTicketStatus = exports.listSupportTickets = exports.getSupportTicket = exports.addSupportResponse = exports.createSupportTicket = void 0;
const supportService = __importStar(require("../services/contactSupport.services"));
const auditService = __importStar(require("../services/audit.services"));
const createSupportTicket = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const { subject, message, imageUrl } = req.body;
        const data = await supportService.createSupportTicket({
            userId,
            subject,
            message,
            imageUrl,
        });
        await auditService.createAudit({
            description: "Successfully User Ticket Created",
            type: "SUBMIT_TICKET",
            userId: req?.user?.id,
        });
        res.status(201).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createSupportTicket = createSupportTicket;
const addSupportResponse = async (req, res) => {
    try {
        const responderId = Number(req.user?.id);
        const { contactSupportId, message, imageUrl } = req.body;
        const data = await supportService.addSupportResponse({
            contactSupportId,
            responderId,
            message,
            imageUrl,
        });
        await auditService.createAudit({
            description: "Support Response",
            type: "SUPPORT_RESPONSE",
            userId: responderId,
        });
        res.status(201).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.addSupportResponse = addSupportResponse;
const getSupportTicket = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = await supportService.getSupportTicket(id);
        if (!data) {
            return res
                .status(404)
                .json({ success: false, message: "Support ticket not found" });
        }
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getSupportTicket = getSupportTicket;
const listSupportTickets = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const role = req.user?.role;
        const data = await supportService.listSupportTickets(role, userId);
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.listSupportTickets = listSupportTickets;
const updateTicketStatus = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;
        const data = await supportService.updateTicketStatus(id, status);
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateTicketStatus = updateTicketStatus;
