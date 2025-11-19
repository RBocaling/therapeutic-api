import { Router } from "express";
import * as  user from "../controllers/user.controllers";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.get("/get-info", authenticateUser, user.getUserInfo as any);
router.get("/", user.listUsersController);
router.get("/list-w-survey", user.listUsersWithSurvey as any);
router.get("/:id", user.getUserByIdController as any);

export default router;
