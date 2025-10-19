import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return; 
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET!);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};
