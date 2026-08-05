import { useState } from "react";
import { useNavigate } from "react-router-dom";


const AdminLogin = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();


        const response = await fetch(
            "https://jelegs-backend-cms.onrender.com/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        );


        const data = await response.json();


        if (data.success) {

            localStorage.setItem("token", data.token);
            localStorage.setItem("adminData", JSON.stringify(data.admin)); // ← ADD THIS LINE

            navigate("/admin/dashboard");

        } else {

            alert(data.message);

        }

    };


    return (
        <div className="min-h-screen flex items-center justify-center">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-4 p-8 shadow rounded-xl"
            >

                <h1 className="text-2xl font-bold">
                    Admin Login
                </h1>


                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="w-full border p-3 rounded"
                />


                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="w-full border p-3 rounded"
                />


                <button
                    className="w-full bg-black text-white py-3 rounded"
                >
                    Login
                </button>

            </form>

        </div>
    );
};


export default AdminLogin;