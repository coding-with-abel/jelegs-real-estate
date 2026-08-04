import express from "express";
import { loginAdmin, registerAdmin, getAllAdmins, deleteAdmin } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/register-admin", protect, registerAdmin);
router.get("/admins", protect, getAllAdmins);
router.delete("/admins/:adminId", protect, deleteAdmin);

export default router;