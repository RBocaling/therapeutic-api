import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userInfoRoutes from "./routes/user.routes";
import surveyRoutes from "./routes/survey.routes";
import adminsRoutes from "./routes/admin.routes";
import chatRoutes from "./routes/chat.routes";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user-info", userInfoRoutes);
app.use("/api/survey", surveyRoutes);
app.use("/api/admins", adminsRoutes);
app.use("/api/chat", chatRoutes);


export default app;
