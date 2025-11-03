import { Request, Response } from "express";
import * as schoolService from "../services/school.services";

export const addSchool = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const data = await schoolService.createSchool(name);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addCourse = async (req: Request, res: Response) => {
  try {
    const { schoolId, name } = req.body;
    const data = await schoolService.createCourse(Number(schoolId), name);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getSchools = async (req: Request, res: Response) => {
  try {
    const data = await schoolService.listSchools();
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCoursesBySchool = async (req: Request, res: Response) => {
  try {
    const schoolId = Number(req.params.schoolId);
    const data = await schoolService.listCoursesBySchool(schoolId);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
