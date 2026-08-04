import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["owner", "manager", "viewer"],
            default: "viewer",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Admin", adminSchema);