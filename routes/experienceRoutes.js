
import express from "express";
import {
  getAllExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";

const router = express.Router();

router.get("/getall", getAllExperiences);

router.get("/:id", getExperienceById);

router.post("/add", createExperience);

router.put("/update/:id", updateExperience);

router.delete("/delete/:id", deleteExperience);

export default router;
