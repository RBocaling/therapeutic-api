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
exports.deleteContentPost = exports.updateCourseWithStructureController = exports.getRatingsByContentController = exports.addOrUpdateRatingController = exports.updateCourseController = exports.getCourseByIdController = exports.mylistCoursesController = exports.listCoursesController = exports.createCourseController = void 0;
const courseService = __importStar(require("../services/content-management.services"));
const createCourseController = async (req, res) => {
    try {
        const uploadedById = Number(req.user?.id);
        const data = {
            title: req.body.title,
            category: req.body.category,
            description: req.body.description,
            type: req.body.type,
            uploadedById,
            modules: req.body.modules,
            images: req.body.images,
            videoUrl: req.body.videoUrl,
            audioUrl: req.body.audioUrl,
        };
        const course = await courseService.createCourse(data);
        res.status(201).json({ success: true, data: course });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createCourseController = createCourseController;
const listCoursesController = async (_req, res) => {
    try {
        const data = await courseService.listCourses();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.listCoursesController = listCoursesController;
const mylistCoursesController = async (req, res) => {
    try {
        const data = await courseService.getMylistCourses(Number(req?.user?.id));
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.mylistCoursesController = mylistCoursesController;
const getCourseByIdController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = await courseService.getCourseById(id);
        if (!data)
            return res
                .status(404)
                .json({ success: false, message: "Course not found" });
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCourseByIdController = getCourseByIdController;
const updateCourseController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = { title: req.body.title, description: req.body.description };
        const updated = await courseService.updateCourse(id, data);
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateCourseController = updateCourseController;
const addOrUpdateRatingController = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const { contentId, rating, description } = req.body;
        const result = await courseService.addOrUpdateRating(userId, contentId, rating, description);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.addOrUpdateRatingController = addOrUpdateRatingController;
const getRatingsByContentController = async (req, res) => {
    try {
        const contentId = Number(req.params.id);
        const data = await courseService.getRatingsByContent(contentId);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getRatingsByContentController = getRatingsByContentController;
const updateCourseWithStructureController = async (req, res) => {
    try {
        const courseId = Number(req.params.id);
        const result = await courseService.updateCourseWithStructure(courseId, req.body);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateCourseWithStructureController = updateCourseWithStructureController;
const deleteContentPost = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updated = await courseService.deleteCourse(id);
        res.status(200).json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteContentPost = deleteContentPost;
