"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = (req, res, next) => {
    // 1) Try Authorization header first (Bearer token)
    const authHeader = (req.headers?.authorization ||
        req.headers?.Authorization);
    let token;
    if (authHeader && typeof authHeader === "string") {
        const parts = authHeader.split(" ");
        if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
            token = parts[1];
        }
    }
    // 2) Fallback to cookie (legacy)
    if (!token) {
        token = req.cookies?.accessToken ?? req.cookies?.accessToken;
    }
    // 3) No token -> Unauthorized
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // 4) Verify token
    try {
        const secret = process.env.ACCESS_SECRET;
        if (!secret) {
            console.error("ACCESS_SECRET not set");
            return res.status(500).json({ message: "Server misconfiguration" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // attach decoded payload to req.user
        req.user = decoded;
        return next();
    }
    catch (err) {
        // token invalid or expired
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authenticateUser = authenticateUser;
