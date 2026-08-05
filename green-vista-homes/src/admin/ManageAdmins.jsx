import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ManageAdmins = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentAdminId, setCurrentAdminId] = useState("");

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "https://jelegs-backend-cms.onrender.com/api/auth/admins",
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (data.success) {
                    setAdmins(data.admins);
                    // Get current admin ID from token (optional, for display)
                    const adminData = JSON.parse(atob(token.split('.')[1]));
                    setCurrentAdminId(adminData.id);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error(error);
                alert("Failed to fetch admins");
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    const handleDelete = async (adminId, username) => {
        if (!window.confirm(`Are you sure you want to delete admin: ${username}?`)) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `https://jelegs-backend-cms.onrender.com/api/auth/admins/${adminId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Admin deleted successfully!");
                setAdmins(admins.filter(a => a._id !== adminId));
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete admin");
        }
    };

    if (loading) {
        return <div className="p-10">Loading...</div>;
    }

    return (
        <div className="p-10">

            <Link 
                to="/admin/dashboard"
                className="text-blue-600 hover:underline mb-6 inline-block"
            >
                ← Back to Dashboard
            </Link>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">
                    Manage Admins
                </h1>
                <Link
                    to="/admin/register-admin"
                    className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800"
                >
                    + Create Admin
                </Link>
            </div>

            <div className="grid gap-4">
                {admins.length === 0 ? (
                    <p className="text-gray-600">No admins found</p>
                ) : (
                    admins.map((admin) => (
                        <div
                            key={admin._id}
                            className="border rounded-lg p-6 shadow-sm"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                <div>
                                    <h2 className="text-lg font-bold">
                                        {admin.username}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {admin.email}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm">
                                        <span className="font-semibold">Role:</span>{" "}
                                        <span className={
                                            admin.role === "owner" 
                                                ? "bg-purple-100 text-purple-800 px-3 py-1 rounded text-xs font-semibold"
                                                : admin.role === "manager"
                                                ? "bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs font-semibold"
                                                : "bg-gray-100 text-gray-800 px-3 py-1 rounded text-xs font-semibold"
                                        }>
                                            {admin.role}
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">
                                        {currentAdminId === admin._id && (
                                            <span className="font-semibold text-green-600">
                                                (You)
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="flex gap-2 md:justify-end">
                                    {currentAdminId !== admin._id && (
                                        <button
                                            onClick={() => handleDelete(admin._id, admin.username)}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
};

export default ManageAdmins;