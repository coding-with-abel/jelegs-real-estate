import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login attempt with email:", email);

        const admin = await Admin.findOne({ email });

        console.log("Admin found:", admin ? "Yes" : "No");

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            success: true,
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
            },
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const registerAdmin = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const requestingAdminId = req.admin.id; // From protect middleware

        // Check if requesting admin is owner or manager
        const requestingAdmin = await Admin.findById(requestingAdminId);

        if (!requestingAdmin || (requestingAdmin.role !== "owner" && requestingAdmin.role !== "manager")) {
            return res.status(403).json({
                success: false,
                message: "Only owner and manager can create new admins.",
            });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Email or username already exists.",
            });
        }

        // Check total admin count (max 3)
        const adminCount = await Admin.countDocuments();
        if (adminCount >= 3) {
            return res.status(400).json({
                success: false,
                message: "Maximum 3 admins allowed.",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newAdmin = await Admin.create({
            username,
            email,
            password: hashedPassword,
            role: role || "viewer", // Default to viewer if not specified
        });

        res.status(201).json({
            success: true,
            message: "Admin created successfully!",
            admin: {
                id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email,
                role: newAdmin.role,
            },
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create admin",
        });
    }
};

export const getAllAdmins = async (req, res) => {
    try {
        const requestingAdminId = req.admin.id;

        // Only owner can view all admins
        const requestingAdmin = await Admin.findById(requestingAdminId);

        if (!requestingAdmin || requestingAdmin.role !== "owner") {
            return res.status(403).json({
                success: false,
                message: "Only owner can view all admins.",
            });
        }

        const admins = await Admin.find().select("-password");

        res.status(200).json({
            success: true,
            admins,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch admins",
        });
    }
};

export const deleteAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;
        const requestingAdminId = req.admin.id;

        // Only owner can delete admins
        const requestingAdmin = await Admin.findById(requestingAdminId);

        if (!requestingAdmin || requestingAdmin.role !== "owner") {
            return res.status(403).json({
                success: false,
                message: "Only owner can delete admins.",
            });
        }

        // Can't delete yourself
        if (adminId === requestingAdminId) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete your own account.",
            });
        }

        const deletedAdmin = await Admin.findByIdAndDelete(adminId);

        if (!deletedAdmin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Admin deleted successfully!",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete admin",
        });
    }
};