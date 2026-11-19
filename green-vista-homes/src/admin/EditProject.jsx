import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm.jsx";

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();

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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(
                    `https://jelegs-backend-cms.onrender.com/api/projects/${id}`
                );
                const data = await response.json();

                if (data.success) {
                    setProject(data.project);
                }
            } catch (error) {
                console.error(error);
                alert("Failed to load project");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

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

    const handleRemoveExistingImage = (index) => {
        setProject({
            ...project,
            images: project.images.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        setSaving(true);

        try {
            const formData = new FormData();

            formData.append("name", project.name);
            formData.append("location", project.location);
            formData.append("beds", project.beds);
            formData.append("baths", project.baths);
            formData.append("description", project.description);
            formData.append("featured", project.featured);
            formData.append("features", JSON.stringify(project.features));
            formData.append("currentImages", JSON.stringify(project.images || []));

            selectedImages.forEach((image) => {
                formData.append("images", image);
            });

            const response = await fetch(
                `https://jelegs-backend-cms.onrender.com/api/projects/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Project updated successfully!");
                navigate("/admin/projects");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to update project");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary/30">
                <div className="mx-auto max-w-3xl animate-pulse space-y-5 px-5 pt-8 sm:px-8 sm:pt-12">
                    <div className="h-4 w-32 rounded bg-muted" />
                    <div className="h-8 w-48 rounded-lg bg-muted" />
                    <div className="h-72 rounded-2xl bg-muted" />
                    <div className="h-48 rounded-2xl bg-muted" />
                </div>
            </div>
        );
    }

    return (
        <ProjectForm
            title="Edit project"
            subtitle={project.name}
            submitLabel="Save changes"
            submitting={saving}
            project={project}
            onChange={handleChange}
            featureInput={featureInput}
            setFeatureInput={setFeatureInput}
            onAddFeature={handleAddFeature}
            onRemoveFeature={handleRemoveFeature}
            onImageChange={handleImageChange}
            imagePreviews={imagePreviews}
            onRemoveImage={handleRemoveImage}
            existingImages={project.images || []}
            onRemoveExisting={handleRemoveExistingImage}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/admin/projects")}
        />
    );
};

export default EditProject;