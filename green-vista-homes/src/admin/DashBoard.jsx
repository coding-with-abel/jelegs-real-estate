import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FolderKanban, PlusCircle, Users, UserPlus, ArrowRight, LogOut, ExternalLink } from "lucide-react";
import logo from "@/assets/logo.png";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        const adminData = localStorage.getItem("adminData");

        if (adminData) {
            const admin = JSON.parse(adminData);
            setUserRole(admin.role);
            setUsername(admin.name || admin.username);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("adminData");
        navigate("/admin/login");
    };

    const cards = [
        { to: "/admin/add-project", title: "Add project", text: "List a new home on the website.", icon: PlusCircle },
        { to: "/admin/projects", title: "Manage projects", text: "Edit, publish or remove listings.", icon: FolderKanban },
        ...(userRole === "owner"
            ? [{ to: "/admin/manage-admins", title: "Manage admins", text: "View, edit or remove admin accounts.", icon: Users }]
            : []),
        ...(userRole === "owner" || userRole === "manager"
            ? [{ to: "/admin/register-admin", title: "Add admin", text: "Give someone access to the panel.", icon: UserPlus }]
            : []),
    ];

    return (
        <div className="min-h-screen bg-secondary/30 text-foreground">
            <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <img src={logo} alt="Jelegs" className="h-9 w-9 shrink-0 object-contain" />
                        <div className="min-w-0 leading-tight">
                            <p className="truncate text-sm font-bold">Jelegs Real Estate</p>
                            <p className="text-xs text-muted-foreground">Admin panel</p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="View website"
                            className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-foreground/70 transition-all duration-200 hover:bg-secondary active:scale-95 sm:px-4"
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span className="hidden sm:inline">View website</span>
                        </a>
                        <button
                            onClick={handleLogout}
                            aria-label="Log out"
                            className="inline-flex h-10 items-center gap-2 rounded-full bg-red-600 px-3 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700 active:scale-95 sm:px-4 sm:hover:scale-105"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-14">
                <h1 className="break-words text-2xl font-bold tracking-tight sm:text-4xl">
                    Welcome{username ? `, ${username}` : ""}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground sm:text-base">
                    <span>What would you like to do today?</span>
                    {userRole && (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
                            {userRole}
                        </span>
                    )}
                </div>

                <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
                    {cards.map(({ to, title, text, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-background p-4 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-primary/40 hover:shadow-lg active:scale-95 sm:p-5"
                        >
                            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                <Icon className="h-5 w-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold">{title}</p>
                                <p className="text-sm text-muted-foreground">{text}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;