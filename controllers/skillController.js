import { Skill } from "../models/skillSchema.js";

export const addSkill = async (req, res) => {
  try {
    const { name, img } = req.body;

    if (!name || !img) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const skill = await Skill.create({
      name,
      img,
    });

    res.status(200).json({ message: "Skill Added Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal Server Error" });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(400).json({ message: "Skill not found!" });
    }

    await skill.deleteOne();

    res.status(200).json({ message: "Skill Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal Server Error" });
  }
};

export const allSkills = async (req, res) => {
  try {
    const skills = await Skill.find();

    if (!skills.length) {
      return res.status(400).json({ message: "No Skills Found" });
    }

    res
      .status(200)
      .json({ message: "Skills Are Retrieved Successfully", data:skills });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal Server Error" });
  }
};
