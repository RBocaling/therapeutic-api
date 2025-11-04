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
exports.updateTicketStatusController = exports.getAllTicketsController = exports.getUserTicketsController = exports.createTicketController = void 0;
const ticketService = __importStar(require("../services/ticket.services"));
const createTicketController = async (req, res) => {
    try {
        const payload = {
            userId: Number(req.user?.id),
            description: req.body.description,
            imageUrl: req.body.imageUrl,
        };
        const ticket = await ticketService.createTicket(payload);
        res.json("Successfully Submited");
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createTicketController = createTicketController;
const getUserTicketsController = async (req, res) => {
    try {
        const tickets = await ticketService.getUserTickets(Number(req.user?.id));
        res.json(tickets);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getUserTicketsController = getUserTicketsController;
const getAllTicketsController = async (_, res) => {
    try {
        const tickets = await ticketService.getAllTickets();
        res.json(tickets);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllTicketsController = getAllTicketsController;
const updateTicketStatusController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;
        const updated = await ticketService.updateTicketStatus(id, status);
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(400).json("Successfully Update");
    }
};
exports.updateTicketStatusController = updateTicketStatusController;
