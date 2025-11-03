import { Router } from "express";
import {
  createTicketController,
  getUserTicketsController,
  getAllTicketsController,
  updateTicketStatusController,
} from "../controllers/ticket.controllers";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticateUser, createTicketController);
router.get("/my-tickets", authenticateUser, getUserTicketsController);
router.get("/", authenticateUser, getAllTicketsController);
router.put("/status/:id", authenticateUser, updateTicketStatusController);

export default router;
