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
        const body = req.body;

        const newImageUrls = req.files ? req.files.map((file) => file.path) : [];

        const updateData = {};

        if (body.name !== undefined) updateData.name = body.name;
        if (body.location !== undefined) updateData.location = body.location;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.beds) updateData.beds = Number(body.beds);
        if (body.baths) updateData.baths = Number(body.baths);
        if (body.featured !== undefined) {
            updateData.featured = body.featured === "true" || body.featured === true;
        }
        if (body.features !== undefined) {
            updateData.features = JSON.parse(body.features);
        }

        // Only touch images when the edit form sent them
        if (body.currentImages !== undefined || newImageUrls.length > 0) {
            let base;
            if (body.currentImages !== undefined) {
                base = JSON.parse(body.currentImages);
            } else {
                const existing = await Project.findById(id);
                base = existing ? existing.images : [];
            }
            updateData.images = [...base, ...newImageUrls];
        }

        const project = await Project.findByIdAndUpdate(id, updateData, {
            returnDocument: "after",
        });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        res.status(200).json({ success: true, project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update project" });
    }
};