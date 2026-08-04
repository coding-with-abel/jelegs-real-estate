import express from "express";
import upload from "../middleware/upload.js";

import {
    createProject,
    getProjects,
    getProject,
    deleteProject,
    updateProject,
} from "../controllers/projectController.js";

import protect from "../middleware/authMiddleware.js";


const router = express.Router();


router.get("/", getProjects);

router.get("/:id", getProject);


router.post(
    "/",
    protect,
    upload.array("images", 6),
    createProject
);

router.put(
    "/:id",
    protect,
    upload.array("images", 6),
    updateProject
);


router.delete(
    "/:id",
    protect,
    deleteProject
);


export default router;