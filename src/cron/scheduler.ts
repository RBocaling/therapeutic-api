import cron from "node-cron";
import { scheduleService } from "../services/scheduleService";

// Runs every minute
cron.schedule("* * * * *", async () => {
  const count = await scheduleService.processDueSessions();
  if (count > 0) {
    console.log(`⏰ Processed ${count} due sessions.`);
  }
});
