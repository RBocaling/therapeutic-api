// src/controllers/contentCourse.controller.ts
import { Request, Response } from "express";
import * as service from "../services/content-management.services";

export const createFullCourseController = async (
  req: Request,
  res: Response
) => {
  try {
    const uploadedById = Number(req.user?.id);
    const data = { ...req.body, uploadedById };
    const course = await service.createFullCourse(data);
    res.status(201).json(course);
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const listCoursesController = async (req: Request, res: Response) => {
  try {
    const courses = await service.listCourses();
    res.json(courses);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCourseByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const course = await service.getCourseById(id);
    res.json(course);
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const updateCourseController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const course = await service.updateCourse(id, req.body);
    res.json(course);
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateModuleController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const module = await service.updateModule(id, req.body);
    res.json(module);
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateLessonController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const lesson = await service.updateLesson(id, req.body);
    res.json(lesson);
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateContentController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const content = await service.updateContent(id, req.body);
    res.json(content);
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const addOrUpdateRatingController = async (
  req: Request,
  res: Response
) => {
  try {
    const { contentId, rating, description } = req.body;
    const data = await service.addOrUpdateRating(
      Number(req.user?.id),
      contentId,
      rating,
      description
    );
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getRatingsByContentController = async (
  req: Request,
  res: Response
) => {
  try {
    const contentId = Number(req.params.contentId);
    const ratings = await service.getRatingsByContent(contentId);
    res.json(ratings);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
