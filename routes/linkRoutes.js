import express from "express"
import { createLink, getLinks, updateLink } from "../controllers/linkController.js";

const router = express.Router();

router.post("/create", createLink);
router.get("/getall", getLinks);
router.put("/update/:id", updateLink);

export default router;