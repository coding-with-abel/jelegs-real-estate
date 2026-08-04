import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        beds: {
            type: Number,
            required: true,
        },

        baths: {
            type: Number,
            required: true,
        },

        features: [
            {
                type: String,
            },
        ],

        images: [
            {
                type: String,
            },
        ],

        description: {
            type: String,
            required: true,
        },

        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Project", projectSchema);