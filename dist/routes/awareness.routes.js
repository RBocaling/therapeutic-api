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
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const campaignController = __importStar(require("../controllers/awareness.controllers"));
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticateUser, campaignController.createCampaign);
router.get("/", auth_middleware_1.authenticateUser, campaignController.listCampaigns);
router.get("/get-my-content", auth_middleware_1.authenticateUser, campaignController.getMyPost);
router.get("/moderator-post", auth_middleware_1.authenticateUser, campaignController.moderatorCampaigns);
router.get("/user-request", auth_middleware_1.authenticateUser, campaignController.counselorListCampaigns);
router.get("/user-pending", auth_middleware_1.authenticateUser, campaignController.pendingListCampaigns);
router.put("/status/:id", auth_middleware_1.authenticateUser, campaignController.updateCampaignStatus);
router.get("/:id", auth_middleware_1.authenticateUser, campaignController.getCampaignById);
router.post("/comment/:id", auth_middleware_1.authenticateUser, campaignController.addComment);
router.post("/feedback/:id", auth_middleware_1.authenticateUser, campaignController.submitFeedback);
router.get("/feedbacks/:id", auth_middleware_1.authenticateUser, campaignController.listFeedbacks);
router.put("/:id", auth_middleware_1.authenticateUser, campaignController.updateCampaign);
router.put("/delete/:id", auth_middleware_1.authenticateUser, campaignController.deleteContentPost);
router.put("/approve/:id", auth_middleware_1.authenticateUser, campaignController.updateCampaignPostApprove);
exports.default = router;
