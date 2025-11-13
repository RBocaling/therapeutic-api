import { Request, Response } from "express";
import * as schoolService from "../services/office.services";

export const addOffice = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const data = await schoolService.createOffice(name);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addUnit = async (req: Request, res: Response) => {
  try {
    const { schoolId, name } = req.body;
    const data = await schoolService.createUnit(Number(schoolId), name);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getOffice = async (req: Request, res: Response) => {
  try {
    const data = await schoolService.listOffice();
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUnitByOffice = async (req: Request, res: Response) => {
  try {
    const schoolId = Number(req.params.officeId);
    const data = await schoolService.listUnitByOffice(schoolId);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// updated
export const updateOffice = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, isDeleted} = req.body;
    const data = await schoolService.updateOffice(id, name, isDeleted);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const updateUnit = async (req: Request, res: Response) => {
  try {
     const id = Number(req.params.id);
     const { name, isDeleted } = req.body;
    const data = await schoolService.updateUnit(id, name, isDeleted);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
