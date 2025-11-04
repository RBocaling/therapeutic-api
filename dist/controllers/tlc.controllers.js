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
exports.completeTasks = exports.getPlanById = exports.getUserPlans = exports.createGuidedTlc = void 0;
const tlcService = __importStar(require("../services/tlc.services"));
const createGuidedTlc = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const result = await tlcService.generateGuidedTlc(userId, {
            score: 75,
            resultCategory: "Crisis",
        });
        res.status(201).json({ success: true, data: result });
    }
    catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};
exports.createGuidedTlc = createGuidedTlc;
const getUserPlans = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const plans = await tlcService.getAllPlansByUser(userId);
        res.json({ success: true, data: plans });
    }
    catch (error) {
        res.status(500).json({ success: false, message: String(error) });
    }
};
exports.getUserPlans = getUserPlans;
const getPlanById = async (req, res) => {
    try {
        const planId = Number(req.params.planId);
        const plan = await tlcService.getPlanWithDaysById(planId);
        if (!plan)
            return res
                .status(404)
                .json({ success: false, message: "Plan not found" });
        res.json({ success: true, data: plan });
    }
    catch (error) {
        res.status(500).json({ success: false, message: String(error) });
    }
};
exports.getPlanById = getPlanById;
const completeTasks = async (req, res) => {
    try {
        const planId = Number(req.body.planId);
        const dayNumber = Number(req.body.dayNumber);
        const taskIndices = req.body.taskIndices;
        if (!Array.isArray(taskIndices))
            throw new Error("taskIndices must be an array");
        const result = await tlcService.updateTasks(planId, dayNumber, taskIndices);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: String(error) });
    }
};
exports.completeTasks = completeTasks;
