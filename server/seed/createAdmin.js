import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();

        const existingAdmin = await Admin.findOne({
            email: "olanrewajuabel9@gmail.com",
        });

        if (existingAdmin) {
            console.log("Admin already exists.");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash("Admin12345", 10);

        await Admin.create({
            username: "Abel",
            email: "olanrewajuabel9@gmail.com",
            password: hashedPassword,
        });

        console.log("Admin created successfully.");
        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();