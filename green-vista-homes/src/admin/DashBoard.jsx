import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const adminData = localStorage.getItem("adminData");
        
        if (adminData) {
            const admin = JSON.parse(adminData);
            setUserRole(admin.role);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("adminData");
        navigate("/admin/login");
    };

    return (
        <div className="p-10">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold">
                    Admin Dashboard
                </h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
                >
                    Logout
                </button>
            </div>

            <div className="flex gap-6 flex-wrap">
                <Link
                    to="/admin/add-project"
                    className="bg-green-700 text-white px-6 py-4 rounded-lg"
                >
                    Add Project
                </Link>

                <Link
                    to="/admin/projects"
                    className="bg-green-700 text-white px-6 py-4 rounded-lg"
                >
                    Manage Projects
                </Link>

                {userRole === "owner" && (
                    <Link
                        to="/admin/manage-admins"
                        className="bg-green-700 text-white px-6 py-4 rounded-lg"
                    >
                        Manage Admins
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Dashboard;