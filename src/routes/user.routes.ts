import { Router } from "express";
import * as  user from "../controllers/user.controllers";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.get("/get-info", authenticateUser, user.getUserInfo as any);

export default router;
