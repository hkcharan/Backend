import express from "express";
import {
  askChatbot,
  getPersonalData,
  updatePersonalData,
} from "../controllers/chatbotController.js";

const router = express.Router();

router.get("/personal-data", getPersonalData);
router.post("/update-personal-data", updatePersonalData);
router.post("/ask", askChatbot);

export default router;
