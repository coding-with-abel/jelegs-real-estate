import { useState } from "react";

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
        console.log("Files selected:", files);
        setSelectedImages(files);

        // Create previews
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
            // Create FormData for file upload
            const formData = new FormData();
            
            // Add project data
            formData.append("name", project.name);
            formData.append("location", project.location);
            formData.append("beds", project.beds);
            formData.append("baths", project.baths);
            formData.append("description", project.description);
            formData.append("featured", project.featured);
            formData.append("features", JSON.stringify(project.features));

            // Add images
            console.log("Selected images:", selectedImages);
            selectedImages.forEach((image) => {
                formData.append("images", image);
            });

            console.log("FormData entries:", Array.from(formData.entries()));

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

        <div className="max-w-4xl mx-auto p-10">

            <h1 className="text-3xl font-bold mb-8">
                Add New Project
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                <input
                    name="name"
                    placeholder="Project Title"
                    value={project.name}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />

                <input
                    name="location"
                    placeholder="Location"
                    value={project.location}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />

                <input
                    name="beds"
                    type="number"
                    placeholder="Bedrooms"
                    value={project.beds}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />

                <input
                    name="baths"
                    type="number"
                    placeholder="Bathrooms"
                    value={project.baths}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    rows="6"
                    value={project.description}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />

                <div className="border rounded p-4 bg-gray-50">
                    <h3 className="text-lg font-bold mb-4">Images</h3>
                    
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border rounded p-3 mb-4"
                    />

                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border rounded p-4 bg-gray-50">
                    <h3 className="text-lg font-bold mb-4">Features</h3>
                    
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Add a feature (e.g., Swimming Pool, Garden, Home Theater)"
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddFeature();
                                }
                            }}
                            className="flex-1 border rounded p-3"
                        />
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>

                    {project.features.length > 0 && (
                        <div className="space-y-2">
                            {project.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-white border rounded p-3"
                                >
                                    <span>{feature}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(index)}
                                        className="text-red-600 hover:text-red-700 font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <label className="flex gap-3 items-center">

                    <input
                        type="checkbox"
                        name="featured"
                        checked={project.featured}
                        onChange={handleChange}
                    />

                    Featured Project

                </label>

                <button
                    type="submit"
                    disabled={uploading}
                    className="bg-green-700 text-white px-8 py-3 rounded-lg disabled:bg-gray-500"
                >
                    {uploading ? "Uploading..." : "Publish Project"}
                </button>

            </form>

        </div>

    );

};

export default AddProject;