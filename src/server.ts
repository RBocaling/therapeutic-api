import dotenv from "dotenv";
dotenv.config();
import app from './app';
import "./cron/scheduler"; 


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
