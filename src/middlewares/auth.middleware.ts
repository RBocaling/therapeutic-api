import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1) Try Authorization header first (Bearer token)
  const authHeader = (req.headers?.authorization ||
    req.headers?.Authorization) as string | undefined;

  let token: string | undefined;

  if (authHeader && typeof authHeader === "string") {
    const parts = authHeader.split(" ");
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }

  // 2) Fallback to cookie (legacy)
  if (!token) {
    token = (req as any).cookies?.accessToken ?? req.cookies?.accessToken;
  }

  // 3) No token -> Unauthorized
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // 4) Verify token
  try {
    const secret = process.env.ACCESS_SECRET;
    if (!secret) {
      console.error("ACCESS_SECRET not set");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const decoded = jwt.verify(token, secret);
    // attach decoded payload to req.user
    (req as any).user = decoded;
    return next();
  } catch (err) {
    // token invalid or expired
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
