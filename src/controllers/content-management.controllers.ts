import { Request, Response } from "express";
import * as courseService from "../services/content-management.services";

export const createCourseController = async (req: Request, res: Response) => {
  try {
    const uploadedById = Number(req.user?.id);
    const data = {
      title: req.body.title,
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listCoursesController = async (_req: Request, res: Response) => {
  try {
    const data = await courseService.listCourses();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const mylistCoursesController = async (req: Request, res: Response) => {
  try {
    const data = await courseService.getMylistCourses(Number(req?.user?.id));
    res.json({ success: true, data });
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
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCourseController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = { title: req.body.title, description: req.body.description };
    const updated = await courseService.updateCourse(id, data);
    res.json({ success: true, data: updated });
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
    const { contentId, rating, description } = req.body;
    const result = await courseService.addOrUpdateRating(
      userId,
      contentId,
      rating,
      description
    );
    res.json({ success: true, data: result });
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
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCourseWithStructureController = async (
  req: Request,
  res: Response
) => {
  try {
    const courseId = Number(req.params.id);
    const result = await courseService.updateCourseWithStructure(
      courseId,
      req.body
    );
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContentPost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await courseService.deleteCourse(id);
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
