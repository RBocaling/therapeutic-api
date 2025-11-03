import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import * as peerController from "../controllers/peerSupport.controllers";

const router = Router();

router.post("/", authenticateUser, peerController.createPeerSupport as any);
router.get("/", authenticateUser, peerController.listPeerSupports);
router.get("/:id", authenticateUser, peerController.getPeerSupportById as any);
router.post("/:id/message", authenticateUser, peerController.sendMessage);
router.get("/:id/messages", authenticateUser, peerController.listMessages);
router.post("/:id/close", authenticateUser, peerController.closePeerSupport);

export default router;
