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
exports.closePeerSupport = exports.listMessages = exports.sendMessage = exports.getPeerSupportById = exports.listPeerSupports = exports.createPeerSupport = void 0;
const peerService = __importStar(require("../services/peerSupport.services"));
const createPeerSupport = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        if (!userId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const data = await peerService.createPeerSupport({
            userId,
            title: req.body.title,
            category: req.body.category,
            priority: req.body.priority,
            message: req.body.message,
            imageUrl: req.body.imageUrl,
            isAnonymous: req.body.isAnonymous,
            moderator: req?.user?.role === "MODERATOR"
                ? `${req?.user?.firstName} ${req?.user?.lastName}`
                : null,
        });
        res.status(201).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
exports.createPeerSupport = createPeerSupport;
const listPeerSupports = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const data = await peerService.listPeerSupports(userId);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
exports.listPeerSupports = listPeerSupports;
const getPeerSupportById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = await peerService.getPeerSupportById(id);
        if (!data)
            return res
                .status(404)
                .json({ success: false, message: "Peer support not found" });
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
exports.getPeerSupportById = getPeerSupportById;
const sendMessage = async (req, res) => {
    try {
        const peerSupportId = Number(req.params.id);
        const role = req.user?.role;
        const fromMessage = role === "MODERATOR" ? "MODERATOR" : "USER";
        const data = await peerService.sendMessage({
            peerSupportId,
            fromMessage,
            message: req.body.message,
            imageUrl: req.body.imageUrl,
        });
        res.status(201).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
exports.sendMessage = sendMessage;
const listMessages = async (req, res) => {
    try {
        const peerSupportId = Number(req.params.id);
        const data = await peerService.listMessages(peerSupportId);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
exports.listMessages = listMessages;
const closePeerSupport = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = await peerService.closePeerSupport(id);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
exports.closePeerSupport = closePeerSupport;
