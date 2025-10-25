import { Request, Response } from "express";
import * as contentManagement from "../services/content-management.services";

export const createContentController = async (req: Request, res: Response) => {
  try {
    const payload = {
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      category: req.body.category,
      targetAudience: req.body.targetAudience,
      content: req.body.content,
      videoUrl: req.body.videoUrl,
      uploadedById: Number(req.user?.id),
    };
    const content = await contentManagement.createContent(payload);
    res.json({ content });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listContentsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; 
    const contents = await contentManagement.listContents(userId);
    res.json({ contents });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
export const viewContentById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const contents = await contentManagement.viewContentById(id);
    res.json({ contents });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateContentController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payload = req.body;
    const content = await contentManagement.updateContent(id, payload);
    res.json({ content });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteContentController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await contentManagement.deleteContent(id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const addOrUpdateRating = async (req: Request, res: Response) => {
  try {
    const { contentId, rating, description } = req.body;
    if (!contentId || !rating) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const result = await contentManagement.addOrUpdateRating(
      Number(req?.user?.id),
      contentId,
      rating,
      description
    );
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: String(error) });
  }
};