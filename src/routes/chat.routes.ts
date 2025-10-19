import { authenticateUser } from './../middlewares/auth.middleware';
import { Router } from "express";
import * as chatController from "../controllers/chat.controllers";

const router = Router();

router.post("/session",  authenticateUser, chatController.createSession);
router.get("/sessions", authenticateUser, chatController.listSessions);
router.get("/messages/:chatSessionId",authenticateUser ,  chatController.getMessages);
router.post("/message", authenticateUser, chatController.sendMessage);
router.post("/message/ai",authenticateUser,  chatController.sendAIMessage);

export default router;
