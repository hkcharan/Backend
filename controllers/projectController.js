import { Project } from "../models/projectSchema.js";
import { v2 as cloudinary } from "cloudinary";

// Create a new project with multiple screenshots
export const createProject = async (req, res) => {
  try {
    const { name, technologies, githubLink, liveLink, description,details, category, pinned, hosted, sourceCode } = req.body;

    // Upload multiple screenshots
    const screenshots = [];
    if (req.files && req.files.screenshots) {
      const files = Array.isArray(req.files.screenshots) ? req.files.screenshots : [req.files.screenshots];

      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: "portfolio_screenshots" });
        screenshots.push(result.secure_url); // Save Cloudinary URL to screenshots array
      }
    }

    // Create project document
    const project = new Project({
      name,
      technologies: technologies.split(","), // Split comma-separated technologies
      githubLink,
      liveLink,
      description,
      details,
      category,
      pinned: pinned === "true",
      hosted: hosted === "true",
      sourceCode: sourceCode === "true",
      screenshots,
    });

    await project.save();
    res.status(201).json({ success: true, project , message:"Project Added Successfully!"});
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Fetch all projects
// Fetch projects with optional filter for pinned
export const getProjects = async (req, res) => {
  try {
    // Check for query parameter 'pinned'
    const { pinned } = req.query;

    // If 'pinned' is provided, filter by pinned projects, otherwise fetch all
    const filter = pinned === "true" ? { pinned: true } : {};
    const projects = await Project.find(filter);

    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// Update an existing project
export const updateProject = async (req, res) => {
  try {
    const { name, technologies, githubLink, liveLink, description,details, category, pinned, hosted ,sourceCode} = req.body;
    const screenshots = [];

    const projectId = req.params.id;

    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" }); 

    // Upload new screenshots if provided
    if (req.files && req.files.screenshots) {
      const files = Array.isArray(req.files.screenshots) ? req.files.screenshots : [req.files.screenshots];

      // Delete old screenshots from Cloudinary before uploading new ones
      for (const oldScreenshotUrl of project.screenshots) {
        const publicId = oldScreenshotUrl.split("/").pop().split(".")[0]; // Extract public_id from URL
        await cloudinary.uploader.destroy(`portfolio_screenshots/${publicId}`);
      }

      // Upload new screenshots to Cloudinary
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: "portfolio_screenshots" });
        screenshots.push(result.secure_url); // Save Cloudinary URL to screenshots array
      }
    }

    // Update project details
    project.name = name || project.name;
    project.technologies = technologies ? technologies.split(",") : project.technologies;
    project.githubLink = githubLink || project.githubLink;
    project.liveLink = liveLink || project.liveLink;
    project.description = description || project.description;
    project.details = details || project.details;
    project.category = category || project.category;
    
    // Handle pinned and hosted as booleans
    project.pinned = pinned === 'true';  // Convert string to boolean
    project.hosted = hosted === 'true';  // Convert string to boolean
    project.sourceCode = sourceCode === 'true'; 
    
    // If there are new screenshots, replace the old ones
    if (screenshots.length > 0) {
      project.screenshots = screenshots;
    }

    // Save the updated project
    await project.save();
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


  // Fetch a single project by ID
  export const getProjectDetails = async (req, res) => {
    try {
      const projectId = req.params.id;

      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ message: "Project not found" });
  
      res.status(200).json({ success: true, data:project });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };

// Delete a project and its associated screenshots
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Delete screenshots from Cloudinary
    for (const screenshotUrl of project.screenshots) {
      const publicId = screenshotUrl.split("/").pop().split(".")[0]; // Extract public_id from URL
      await cloudinary.uploader.destroy(`portfolio_screenshots/${publicId}`);
    }

    await project.deleteOne();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
