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
