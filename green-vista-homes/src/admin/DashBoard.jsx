import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FolderKanban, PlusCircle, Users, ArrowRight, LogOut, ExternalLink } from "lucide-react";
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
        {
            to: "/admin/add-project",
            title: "Add project",
            text: "List a new home on the website.",
            icon: PlusCircle,
        },
        {
            to: "/admin/projects",
            title: "Manage projects",
            text: "Edit, publish or remove listings.",
            icon: FolderKanban,
        },
        ...(userRole === "owner"
            ? [
                  {
                      to: "/admin/manage-admins",
                      title: "Manage admins",
                      text: "View, add or remove admin accounts.",
                      icon: Users,
                  },
              ]
            : []),
    ];

    return (
        <div className="min-h-screen bg-secondary/30 text-foreground">
            <header className="border-b border-border/60 bg-background">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Jelegs" className="h-9 w-9 object-contain" />
                        <div className="leading-tight">
                            <p className="text-sm font-bold">Jelegs Real Estate</p>
                            <p className="text-xs text-muted-foreground">Admin panel</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-all duration-200 hover:scale-105 hover:bg-secondary sm:inline-flex"
                        >
                            <ExternalLink className="h-4 w-4" /> View website
                        </a>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-red-700 active:scale-95"
                        >
                            <LogOut className="h-4 w-4" /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Welcome{username ? `, ${username}` : ""}
                </h1>
                <p className="mt-2 text-muted-foreground">
                    What would you like to do today?
                    {userRole && (
                        <span className="ml-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
                            {userRole}
                        </span>
                    )}
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    {cards.map(({ to, title, text, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-background p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-primary/40 hover:shadow-lg active:scale-95"
                        >
                            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                <Icon className="h-5 w-5" />
                            </span>
                            <div className="flex-1">
                                <p className="font-semibold">{title}</p>
                                <p className="text-sm text-muted-foreground">{text}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;