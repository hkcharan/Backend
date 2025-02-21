import express from "express"
import {createSetting, getSetting, updateSetting} from "../controllers/settingController.js"


const router = express.Router();

router.post("/create",createSetting );
router.get("/get",getSetting);
router.put("/update",updateSetting)


export default router;