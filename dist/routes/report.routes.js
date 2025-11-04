"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const report_controllers_1 = require("../controllers/report.controllers");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticateUser, report_controllers_1.getReports);
exports.default = router;
