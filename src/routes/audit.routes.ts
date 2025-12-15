import { Router } from "express";
import * as  audit from "../controllers/audit.controllers";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.post("/",authenticateUser, audit.createAuditsController);
router.get("/", audit.getAllAuditsController);

export default router;
