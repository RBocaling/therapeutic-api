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
exports.updateCaseStatus = exports.getCaseById = exports.deleteCaseIntervention = exports.getCaseIntervention = exports.createCaseIntervention = exports.getCases = exports.createCase = void 0;
const caseService = __importStar(require("../services/case.services"));
const createCase = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const result = await caseService.createCase(userId, req.body);
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createCase = createCase;
const getCases = async (_req, res) => {
    try {
        const cases = await caseService.getAllCases();
        res.json({ success: true, data: cases });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCases = getCases;
const createCaseIntervention = async (req, res) => {
    try {
        const payload = req.body;
        const result = await caseService.createCaseIntervention(payload);
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        console.error("Error creating interventions:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createCaseIntervention = createCaseIntervention;
const getCaseIntervention = async (_req, res) => {
    try {
        const cases = await caseService.getCaseIntervention();
        res.json({ success: true, data: cases });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCaseIntervention = getCaseIntervention;
const deleteCaseIntervention = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: "Invalid id" });
        }
        const result = await caseService.deleteSingleIntervention(id);
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteCaseIntervention = deleteCaseIntervention;
const getCaseById = async (req, res) => {
    try {
        const caseId = Number(req.params.caseId);
        const found = await caseService.getCaseById(caseId);
        if (!found)
            return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: found });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCaseById = getCaseById;
const updateCaseStatus = async (req, res) => {
    try {
        const caseId = Number(req.params.caseId);
        const { status } = req.body;
        const result = await caseService.updateCaseStatus(caseId, status);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateCaseStatus = updateCaseStatus;
