import { Request, Response } from "express";
import * as courseService from "../services/content-management.services";

export const createCourseController = async (req: Request, res: Response) => {
  try {
    const uploadedById = Number(req.user?.id);
    const payload = {
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      uploadedById,
      modules: req.body.modules,
      images: req.body.images,
      videos: req.body.videos,
    };
    const course = await courseService.createCourse(payload);
    res.status(201).json({ success: true, data: course });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listCoursesController = async (_req: Request, res: Response) => {
  try {
    const data = await courseService.listCourses();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = await courseService.getCourseById(id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCourseController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = { title: req.body.title, description: req.body.description };
    const updated = await courseService.updateCourse(id, data);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateModuleController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = { title: req.body.title, order: req.body.order };
    const updated = await courseService.updateModule(id, data);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateLessonController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = {
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      order: req.body.order,
    };
    const updated = await courseService.updateLesson(id, data);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateContentController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      targetAudience: req.body.targetAudience,
      content: req.body.content,
      videoUrls: req.body.videoUrls,
      imageUrls: req.body.imageUrls,
    };
    const updated = await courseService.updateContent(id, data);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCourseImageController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const data = {
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
    };
    const updated = await courseService.updateCourseImage(id, data);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCourseVideoController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const data = {
      title: req.body.title,
      description: req.body.description,
      videoUrl: req.body.videoUrl,
    };
    const updated = await courseService.updateCourseVideo(id, data);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addOrUpdateRatingController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.user?.id);
    const { rating, description, contentId } = req.body;
    if (!rating || rating < 1 || rating > 5)
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
    const result = await courseService.addOrUpdateRating(
      userId,
      contentId,
      rating,
      description
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRatingsByContentController = async (
  req: Request,
  res: Response
) => {
  try {
    const contentId = Number(req.params.id);
    const data = await courseService.getRatingsByContent(contentId);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
