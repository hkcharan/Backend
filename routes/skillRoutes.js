import express from "express"
import { isAuthenticated } from "../middleware/auth.js";
import { addSkill, allSkills, deleteSkill } from "../controllers/skillController.js";


const router = express.Router();

router.post("/add", isAuthenticated, addSkill)
router.get("/getall", allSkills)
router.delete("/delete/:id",isAuthenticated,deleteSkill)

export default router;