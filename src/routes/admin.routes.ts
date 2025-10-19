import express from "express";
import * as adminController from "../controllers/admin.controllers";

const router = express.Router();

router.post("/add-admin", adminController.createAdmin);
router.post("/add-moderator", adminController.createModerator);
router.post("/add-counselor", adminController.createCounselor);

export default router;
