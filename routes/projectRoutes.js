import express from "express";
import { createProject, getProjects, deleteProject, updateProject, getProjectDetails } from "../controllers/projectController.js";

const router = express.Router();

router.post("/add", createProject);
router.get("/getall", getProjects);
router.put("/update/:id",updateProject);
router.get("/details/:id", getProjectDetails);
router.delete("/delete/:id", deleteProject);

export default router;
