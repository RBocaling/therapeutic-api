"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const survey_routes_1 = __importDefault(require("./routes/survey.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const schedule_session_routes_1 = __importDefault(require("./routes/schedule-session.routes"));
const awareness_routes_1 = __importDefault(require("./routes/awareness.routes"));
const referral_routes_1 = __importDefault(require("./routes/referral.routes"));
const content_management_routes_1 = __importDefault(require("./routes/content-management.routes"));
const tlc_routes_1 = __importDefault(require("./routes/tlc.routes"));
const peerSupport_routes_1 = __importDefault(require("./routes/peerSupport.routes"));
const contactSupport_routes_1 = __importDefault(require("./routes/contactSupport.routes"));
const school_routes_1 = __importDefault(require("./routes/school.routes"));
const ticket_routes_1 = __importDefault(require("./routes/ticket.routes"));
const audit_routes_1 = __importDefault(require("./routes/audit.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://therapeutic-ai-clientside-rlacj515n.vercel.app",
    "https://therapeutic-ai-clientside-f5fn.vercel.app",
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/survey", survey_routes_1.default);
app.use("/api/admins", admin_routes_1.default);
app.use("/api/chat", chat_routes_1.default);
app.use("/api/notification", notification_routes_1.default);
app.use("/api/session-schedule", schedule_session_routes_1.default);
app.use("/api/awareness-campaign", awareness_routes_1.default);
app.use("/api/referral", referral_routes_1.default);
app.use("/api/content-management", content_management_routes_1.default);
app.use("/api/tlc-guide", tlc_routes_1.default);
app.use("/api/peer-support", peerSupport_routes_1.default);
app.use("/api/contact-support", contactSupport_routes_1.default);
app.use("/api/general", school_routes_1.default);
app.use("/api/ticket", ticket_routes_1.default);
app.use("/api/audit-trail", audit_routes_1.default);
app.use("/api/reports", report_routes_1.default);
exports.default = app;
