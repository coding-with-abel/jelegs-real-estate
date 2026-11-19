import express from "express";
import { loginAdmin, registerAdmin, getAllAdmins, deleteAdmin, updateAdmin } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/register-admin", protect, registerAdmin);
router.get("/admins", protect, getAllAdmins);
router.put("/admins/:adminId", protect, updateAdmin);
router.delete("/admins/:adminId", protect, deleteAdmin);

export default router;