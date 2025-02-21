import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name:String,
    img:String,
})

export const Skill = mongoose.model("Skill", skillSchema)