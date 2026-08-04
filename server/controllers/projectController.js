import Project from "../models/Project.js";


// CREATE PROJECT
export const createProject = async (req, res) => {
    try {
        console.log("req.files:", req.files);
        console.log("req.body:", req.body);

        const imageUrls = req.files 
            ? req.files.map(file => file.path)
            : [];

        console.log("imageUrls:", imageUrls);

        const features = req.body.features 
            ? JSON.parse(req.body.features)
            : [];

        const projectData = {
            name: req.body.name,
            location: req.body.location,
            beds: Number(req.body.beds),  // ← Convert to number
            baths: Number(req.body.baths), // ← Convert to number
            description: req.body.description,
            featured: req.body.featured === 'true',
            features: features,
            images: imageUrls,
        };

        console.log("projectData to save:", projectData); // ← Log what's being saved

        const project = await Project.create(projectData);

        console.log("Saved project:", project); // ← Log the saved project

        res.status(201).json({
            success: true,
            project,
        });

    } catch (error) {
        console.error("Error creating project:", error); // ← Better error logging
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create project",
        });
    }
};

// GET ALL PROJECTS
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            projects,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch projects",
        });
    }
};


// GET SINGLE PROJECT
export const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        res.status(200).json({
            success: true,
            project,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch project",
        });
    }
};


// DELETE PROJECT
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Project deleted",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete project",
        });
    }
};

// UPDATE PROJECT
export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Get new image URLs from Cloudinary if any were uploaded
        const newImageUrls = req.files 
            ? req.files.map(file => file.path)
            : [];

        const features = req.body.features 
            ? JSON.parse(req.body.features)
            : [];

        const updateData = {
            name: req.body.name,
            location: req.body.location,
            beds: req.body.beds ? Number(req.body.beds) : undefined, // ← Add validation
            baths: req.body.baths ? Number(req.body.baths) : undefined, // ← Add validation
            description: req.body.description,
            featured: req.body.featured === 'true' || req.body.featured === true,
            features: features,
        };

        // Remove undefined values so they don't overwrite existing data
        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        );

        // If new images were uploaded, add them to existing images
        if (newImageUrls.length > 0) {
            const existingProject = await Project.findById(id);
            updateData.images = [...(existingProject.images || []), ...newImageUrls];
        }

        const project = await Project.findByIdAndUpdate(
            id,
            updateData,
            { returnDocument: 'after' }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        res.status(200).json({
            success: true,
            project,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update project",
        });
    }
};