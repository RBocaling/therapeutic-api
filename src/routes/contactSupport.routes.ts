import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import * as supportController from "../controllers/contactSupport.controllers";

const router = Router();

router.post("/", authenticateUser, supportController.createSupportTicket);
router.post(
  "/response",
  authenticateUser,
  supportController.addSupportResponse
);
router.get("/", authenticateUser, supportController.listSupportTickets as any);
router.get("/:id", authenticateUser, supportController.getSupportTicket as any);
router.put(
  "/status/:id",
  authenticateUser,
  supportController.updateTicketStatus
);

export default router;
