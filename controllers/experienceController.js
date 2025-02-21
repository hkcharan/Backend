// controllers/experienceController.js
import {Experience} from "../models/experienceSchema.js";

// GET all experiences
export const getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find();

    res.status(200).json({ message: "All experiences are fetched!",data : experiences});
  } catch (error) {
    res.status(500).json({ message: "Error fetching experiences", error });
  }
};

// GET a single experience by ID
export const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({ message: "Error fetching experience", error });
  }
};

// CREATE a new experience
export const createExperience = async (req, res) => {
  const { title, company, location, location_type, from,to, employment_type } = req.body;

  try {
    const newExperience = new Experience({
      title,
      company,
      location,
      from,
      to,
    });

    await newExperience.save();
    res.status(201).json({message: "Experience Added Successfully!", newExperience});
  } catch (error) {
    res.status(400).json({ message: "Error creating experience", error });
  }
};

// UPDATE an existing experience by ID
export const updateExperience = async (req, res) => {
  try {
    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedExperience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.status(200).json({message: "Experience Updated",updatedExperience});
  } catch (error) {
    res.status(400).json({ message: "Error updating experience", error });
  }
};

// DELETE an experience by ID
export const deleteExperience = async (req, res) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(req.params.id);

    if (!deletedExperience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.status(200).json({ message: "Experience deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting experience", error });
  }
};
