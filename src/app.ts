import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userInfoRoutes from "./routes/user.routes";
import surveyRoutes from "./routes/survey.routes";
import adminsRoutes from "./routes/admin.routes";
import chatRoutes from "./routes/chat.routes";
import notificationRoutes from "./routes/notification.routes";
import sessionScheduleRoutes from "./routes/schedule-session.routes";
import awarenessCampaignRoutes from "./routes/awareness.routes";
import referralRoutes from "./routes/referral.routes";
import contentManagementRoutes from "./routes/content-management.routes";
import tlcGuided from "./routes/tlc.routes";
import peerSupportRoutes from "./routes/peerSupport.routes";
import contactSupportRoutes from "./routes/contactSupport.routes";
import schoolRoutes from "./routes/general.routes";
import ticketRoutes from "./routes/ticket.routes";
import auditRoutes from "./routes/audit.routes";
import reportRoutes from "./routes/report.routes";
import caseRoutes from "./routes/case.routes";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);
 

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userInfoRoutes);
app.use("/api/survey", surveyRoutes);
app.use("/api/admins", adminsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/session-schedule", sessionScheduleRoutes);
app.use("/api/awareness-campaign", awarenessCampaignRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/content-management", contentManagementRoutes);
app.use("/api/tlc-guide", tlcGuided);
app.use("/api/peer-support", peerSupportRoutes);
app.use("/api/contact-support", contactSupportRoutes);
app.use("/api/general", schoolRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/audit-trail", auditRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/case-management", caseRoutes);


export default app;
