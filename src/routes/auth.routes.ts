import { Router } from "express";
import * as auth from "../controllers/auth.controllers";

const router = Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/verify-account", auth.verifyAccount);

export default router;
