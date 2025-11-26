"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const scheduleService_1 = require("../services/scheduleService");
// Runs every minute
node_cron_1.default.schedule("* * * * *", async () => {
    const count = await scheduleService_1.scheduleService.processDueSessions();
    if (count > 0) {
        console.log(`⏰ Processed ${count} due sessions.`);
    }
});
