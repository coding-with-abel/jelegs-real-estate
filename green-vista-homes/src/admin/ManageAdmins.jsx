import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, UserPlus, Pencil, Trash2, X, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";

const API = "https://jelegs-backend-cms.onrender.com/api/auth";

const roleStyles = {
    owner: "bg-purple-100 text-purple-800",
    manager: "bg-blue-100 text-blue-800",
    viewer: "bg-gray-100 text-gray-800",
};

const ManageAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentAdminId, setCurrentAdminId] = useState("");
    const [notice, setNotice] = useState("");

    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: "", username: "", email: "", password: "", role: "viewer" });
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const [deleting, setDeleting] = useState(null);
    const [deleteBusy, setDeleteBusy] = useState(false);

    useEffect(() => {
        document.title = "Manage admins — Jelegs Admin";

        const fetchAdmins = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`${API}/admins`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();

                if (data.success) {
                    setAdmins(data.admins);
                    const adminData = JSON.parse(atob(token.split(".")[1]));
                    setCurrentAdminId(adminData.id);
                } else {
                    setNotice(data.message);
                }
            } catch (error) {
                console.error(error);
                setNotice("Failed to fetch admins. The server may be waking up, so try refreshing.");
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    const showNotice = (message) => {
        setNotice(message);
        setTimeout(() => setNotice(""), 4000);
    };

    const openEdit = (admin) => {
        setEditing(admin);
        setForm({
            name: admin.name || "",
            username: admin.username || "",
            email: admin.email || "",
            password: "",
            role: admin.role,
        });
        setShowPassword(false);
        setFormError("");
    };

    const closeEdit = () => {
        if (!saving) setEditing(null);
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setFormError("");
        setSaving(true);

        try {
            const token = localStorage.getItem("token");

            const body = {
                name: form.name,
                username: form.username,
                email: form.email,
                role: form.role,
            };
            if (form.password) body.password = form.password;

            const response = await fetch(`${API}/admins/${editing._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.success) {
                setAdmins(admins.map((a) => (a._id === editing._id ? { ...a, ...data.admin } : a)));

                // If you edited yourself, refresh the details saved in the browser
                if (editing._id === currentAdminId) {
                    const stored = JSON.parse(localStorage.getItem("adminData") || "{}");
                    localStorage.setItem(
                        "adminData",
                        JSON.stringify({
                            ...stored,
                            name: data.admin.name,
                            username: data.admin.username,
                            email: data.admin.email,
                        })
                    );
                }

                setEditing(null);
                showNotice("Admin updated successfully.");
            } else {
                setFormError(data.message || "Failed to update admin.");
            }
        } catch (error) {
            console.error(error);
            setFormError("Failed to update admin.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleteBusy(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API}/admins/${deleting._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();

            if (data.success) {
                setAdmins(admins.filter((a) => a._id !== deleting._id));
                setDeleting(null);
                showNotice("Admin deleted.");
            } else {
                setDeleting(null);
                showNotice(data.message || "Failed to delete admin.");
            }
        } catch (error) {
            console.error(error);
            setDeleting(null);
            showNotice("Failed to delete admin.");
        } finally {
            setDeleteBusy(false);
        }
    };

    const isSelf = editing && editing._id === currentAdminId;
    const initial = (a) => (a.name || a.username || "?").charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-secondary/30 text-foreground">
            <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
                <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to dashboard
                </Link>

                <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manage admins</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            View, edit or remove people with access to this panel.
                        </p>
                    </div>
                    <Link
                        to="/admin/register-admin"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        <UserPlus className="h-4 w-4" /> Add admin
                    </Link>
                </div>

                {notice && (
                    <div role="status" className="mt-6 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
                        {notice}
                    </div>
                )}

                <div className="mt-8 space-y-4">
                    {loading ? (
                        <>
                            {[0, 1].map((i) => (
                                <div
                                    key={i}
                                    className="flex animate-pulse items-center gap-4 rounded-2xl border border-border/60 bg-background p-5"
                                >
                                    <div className="h-12 w-12 rounded-full bg-muted" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-40 rounded bg-muted" />
                                        <div className="h-3 w-56 rounded bg-muted" />
                                    </div>
                                    <div className="h-8 w-20 rounded-full bg-muted" />
                                </div>
                            ))}
                        </>
                    ) : admins.length === 0 ? (
                        <p className="text-center text-muted-foreground">No admins found.</p>
                    ) : (
                        admins.map((admin) => (
                            <div
                                key={admin._id}
                                className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-background p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                                    {initial(admin)}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="truncate font-semibold">
                                            {admin.name || admin.username}
                                        </h2>
                                        {currentAdminId === admin._id && (
                                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                You
                                            </span>
                                        )}
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                                roleStyles[admin.role] || roleStyles.viewer
                                            }`}
                                        >
                                            {admin.role}
                                        </span>
                                    </div>
                                    <p className="truncate text-sm text-muted-foreground">
                                        @{admin.username} · {admin.email}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(admin)}
                                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:border-primary/40 hover:text-primary active:scale-95"
                                    >
                                        <Pencil className="h-4 w-4" /> Edit
                                    </button>
                                    {currentAdminId !== admin._id && (
                                        <button
                                            onClick={() => setDeleting(admin)}
                                            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-red-700 active:scale-95"
                                        >
                                            <Trash2 className="h-4 w-4" /> Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit modal */}
            {editing && (
                <div
                    className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-5 backdrop-blur-sm"
                    onClick={closeEdit}
                >
                    <form
                        onSubmit={handleSave}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md space-y-4 rounded-3xl bg-background p-7 shadow-2xl"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">Edit admin</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Update the details for @{editing.username}.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeEdit}
                                aria-label="Close"
                                className="grid h-9 w-9 place-items-center transition-transform active:scale-90"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {formError && (
                            <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                                {formError}
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Full name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleFormChange}
                                className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Username</label>
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleFormChange}
                                className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleFormChange}
                                className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-muted-foreground">
                                New password (leave blank to keep the current one)
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleFormChange}
                                    autoComplete="new-password"
                                    placeholder="At least 6 characters"
                                    className="w-full rounded-xl border border-input bg-background py-3 pl-4 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Role</label>
                            {isSelf ? (
                                <div className="mt-1 flex items-center gap-2 rounded-xl bg-secondary/60 px-4 py-3 text-sm capitalize">
                                    <ShieldCheck className="h-4 w-4 text-primary" /> {editing.role}
                                    <span className="text-xs normal-case text-muted-foreground">
                                        (you can't change your own role)
                                    </span>
                                </div>
                            ) : (
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleFormChange}
                                    className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="viewer">Viewer (no admin creation)</option>
                                    <option value="manager">Manager (can create admins)</option>
                                </select>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                            >
                                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                                {saving ? "Saving..." : "Save changes"}
                            </button>
                            <button
                                type="button"
                                onClick={closeEdit}
                                className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-all duration-200 hover:bg-secondary active:scale-95"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Delete confirmation */}
            {deleting && (
                <div
                    className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-5 backdrop-blur-sm"
                    onClick={() => !deleteBusy && setDeleting(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm rounded-3xl bg-background p-7 text-center shadow-2xl"
                    >
                        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-600">
                            <Trash2 className="h-5 w-5" />
                        </span>
                        <h2 className="mt-4 text-xl font-bold tracking-tight">Delete admin?</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {deleting.name || deleting.username} will lose access to the admin panel. This can't be undone.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={deleteBusy}
                                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700 active:scale-95 disabled:opacity-60"
                            >
                                {deleteBusy && <Loader2 className="h-4 w-4 animate-spin" />}
                                {deleteBusy ? "Deleting..." : "Delete"}
                            </button>
                            <button
                                onClick={() => setDeleting(null)}
                                disabled={deleteBusy}
                                className="flex-1 rounded-full border border-border py-3 text-sm font-medium transition-all duration-200 hover:bg-secondary active:scale-95"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAdmins;