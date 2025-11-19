"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/case.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const Case = __importStar(require("../controllers/case.controllers"));
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticateUser, Case.createCase);
router.get("/", auth_middleware_1.authenticateUser, Case.getCases);
router.put("/status/:caseId", auth_middleware_1.authenticateUser, Case.updateCaseStatus);
// intervemtion
router.post("/intervention", auth_middleware_1.authenticateUser, Case.createCaseIntervention);
router.get("/intervention", auth_middleware_1.authenticateUser, Case.getCaseIntervention);
router.delete("/intervention/:id", auth_middleware_1.authenticateUser, Case.deleteCaseIntervention);
router.get("/:caseId", auth_middleware_1.authenticateUser, Case.getCaseById);
exports.default = router;
