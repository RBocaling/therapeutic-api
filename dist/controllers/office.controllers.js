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
exports.updateUnit = exports.updateOffice = exports.getUnitByOffice = exports.getOffice = exports.addUnit = exports.addOffice = void 0;
const schoolService = __importStar(require("../services/office.services"));
const addOffice = async (req, res) => {
    try {
        const { name } = req.body;
        const data = await schoolService.createOffice(name);
        res.status(201).json(data);
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.addOffice = addOffice;
const addUnit = async (req, res) => {
    try {
        const { schoolId, name } = req.body;
        const data = await schoolService.createUnit(Number(schoolId), name);
        res.status(201).json(data);
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.addUnit = addUnit;
const getOffice = async (req, res) => {
    try {
        const data = await schoolService.listOffice();
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getOffice = getOffice;
const getUnitByOffice = async (req, res) => {
    try {
        const schoolId = Number(req.params.officeId);
        const data = await schoolService.listUnitByOffice(schoolId);
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getUnitByOffice = getUnitByOffice;
// updated
const updateOffice = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, isDeleted } = req.body;
        const data = await schoolService.updateOffice(id, name, isDeleted);
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateOffice = updateOffice;
const updateUnit = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, isDeleted } = req.body;
        const data = await schoolService.updateUnit(id, name, isDeleted);
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateUnit = updateUnit;
