import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import * as peerController from "../controllers/peerSupport.controllers";

const router = Router();

router.post("/", authenticateUser, peerController.createPeerSupport as any);
router.post("/message", authenticateUser, peerController.sendPeerMessage as any);
router.get("/messages/:id", authenticateUser, peerController.getPeerMessages);
router.get("/", authenticateUser, peerController.listPeerSupports);

export default router;
