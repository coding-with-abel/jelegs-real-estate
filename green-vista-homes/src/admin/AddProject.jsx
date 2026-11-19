import { useState } from "react";
import ProjectForm from "./ProjectForm.jsx";

const AddProject = () => {

    const [project, setProject] = useState({
        name: "",
        location: "",
        beds: "",
        baths: "",
        description: "",
        features: [],
        featured: false,
    });

    const [featureInput, setFeatureInput] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setProject({
            ...project,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleAddFeature = () => {
        if (featureInput.trim()) {
            setProject({
                ...project,
                features: [...project.features, featureInput.trim()],
            });
            setFeatureInput("");
        }
    };

    const handleRemoveFeature = (index) => {
        setProject({
            ...project,
            features: project.features.filter((_, i) => i !== index),
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);

        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleRemoveImage = (index) => {
        setSelectedImages(selectedImages.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        setUploading(true);

        try {
            const formData = new FormData();

            formData.append("name", project.name);
            formData.append("location", project.location);
            formData.append("beds", project.beds);
            formData.append("baths", project.baths);
            formData.append("description", project.description);
            formData.append("featured", project.featured);
            formData.append("features", JSON.stringify(project.features));

            selectedImages.forEach((image) => {
                formData.append("images", image);
            });

            const response = await fetch(
                "https://jelegs-backend-cms.onrender.com/api/projects",
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Project Added Successfully!");

                setProject({
                    name: "",
                    location: "",
                    beds: "",
                    baths: "",
                    description: "",
                    features: [],
                    featured: false,
                });

                setFeatureInput("");
                setSelectedImages([]);
                setImagePreviews([]);

            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Failed to add project");
        } finally {
            setUploading(false);
        }
    };

    return (
        <ProjectForm
            title="Add project"
            subtitle="List a new home on the website."
            submitLabel="Add project"
            submitting={uploading}
            project={project}
            onChange={handleChange}
            featureInput={featureInput}
            setFeatureInput={setFeatureInput}
            onAddFeature={handleAddFeature}
            onRemoveFeature={handleRemoveFeature}
            onImageChange={handleImageChange}
            imagePreviews={imagePreviews}
            onRemoveImage={handleRemoveImage}
            onSubmit={handleSubmit}
        />
    );
};

export default AddProject;