import { authenticateUser } from './../middlewares/auth.middleware';
import { Router } from "express";
import * as chatController from "../controllers/chat.controllers";

const router = Router();

router.post("/session",  authenticateUser, chatController.createSession);
router.post(
  "/counselor-session",
  authenticateUser,
  chatController.createCounselorSession
);
router.get("/sessions", authenticateUser, chatController.listSessions);
router.get(
  "/messages/:chatSessionId",
  authenticateUser,
  chatController.getMessages
);
router.post("/message", authenticateUser, chatController.sendMessage);
router.post("/message/ai", authenticateUser, chatController.sendAIMessage);
router.get("/clients", authenticateUser, chatController.getCounselorClient);

// chat request
router.post(
  "/chat-request",
  authenticateUser,
  chatController.createChatRequest
);
router.get("/chat-request", authenticateUser, chatController.getChatRequest);
router.get(
  "/my-chat-request",
  authenticateUser,
  chatController.getMyChatRequest
);
router.post(
  "/chat-request-approved",
  authenticateUser,
  chatController.approveChatRequest
);

export default router;
