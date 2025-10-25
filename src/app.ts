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

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

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


export default app;
