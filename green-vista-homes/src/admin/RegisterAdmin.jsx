import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

const input =
    "mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-base transition focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm";
const label = "text-xs font-medium text-muted-foreground";

const RegisterAdmin = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "viewer",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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
        <div className="min-h-screen bg-secondary/30 text-foreground">
            <div className="mx-auto max-w-xl px-4 py-6 sm:px-8 sm:py-12">
                <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to dashboard
                </Link>

                <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Add admin</h1>
                <p className="mt-1 text-sm text-muted-foreground">Give someone access to the admin panel.</p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4 rounded-2xl border border-border/60 bg-background p-5 shadow-[var(--shadow-card)] sm:mt-8 sm:p-7"
                >
                    {error && (
                        <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className={label}>Full name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} autoComplete="off" className={input} required />
                    </div>

                    <div>
                        <label className={label}>Username</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} autoComplete="off" autoCapitalize="none" className={input} required />
                    </div>

                    <div>
                        <label className={label}>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="off" inputMode="email" autoCapitalize="none" className={input} required />
                    </div>

                    <div>
                        <label className={label}>Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                className={`${input} pr-12`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-muted-foreground transition hover:text-foreground active:scale-90"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className={label}>Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} className={input}>
                            <option value="viewer">Viewer (no admin creation)</option>
                            <option value="manager">Manager (can create admins)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? "Creating..." : "Create admin"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterAdmin;