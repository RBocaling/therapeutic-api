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
exports.getCoursesBySchool = exports.getSchools = exports.addCourse = exports.addSchool = void 0;
const schoolService = __importStar(require("../services/school.services"));
const addSchool = async (req, res) => {
    try {
        const { name } = req.body;
        const data = await schoolService.createSchool(name);
        res.status(201).json(data);
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.addSchool = addSchool;
const addCourse = async (req, res) => {
    try {
        const { schoolId, name } = req.body;
        const data = await schoolService.createCourse(Number(schoolId), name);
        res.status(201).json(data);
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.addCourse = addCourse;
const getSchools = async (req, res) => {
    try {
        const data = await schoolService.listSchools();
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getSchools = getSchools;
const getCoursesBySchool = async (req, res) => {
    try {
        const schoolId = Number(req.params.schoolId);
        const data = await schoolService.listCoursesBySchool(schoolId);
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getCoursesBySchool = getCoursesBySchool;
