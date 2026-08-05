import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterAdmin = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "viewer",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "https://jelegs-backend-cms.onrender.com/api/auth/register-admin",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Admin created successfully!");
                navigate("/admin/manage-admins");
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error(error);
            setError("Failed to create admin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-10">

            <Link 
                to="/admin/dashboard"
                className="text-blue-600 hover:underline mb-6 inline-block"
            >
                ← Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold mb-8">
                Create New Admin
            </h1>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full border rounded p-3"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded p-3"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border rounded p-3"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Role
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border rounded p-3"
                    >
                        <option value="viewer">Viewer (No admin creation)</option>
                        <option value="manager">Manager (Can create admins)</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-700 text-white px-8 py-3 rounded-lg disabled:bg-gray-500"
                >
                    {loading ? "Creating..." : "Create Admin"}
                </button>

            </form>

        </div>
    );
};

export default RegisterAdmin;