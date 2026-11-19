import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import logo from "@/assets/logo.png";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [welcomeName, setWelcomeName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://jelegs-backend-cms.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("adminData", JSON.stringify(data.admin));
        setWelcomeName(data.admin.name || data.admin.username);
        setTimeout(() => navigate("/admin/dashboard"), 1500);
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Can't reach the server. It may be waking up, so try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-secondary/40 px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src={logo} alt="Jelegs Real Estate" className="h-14 w-14 object-contain" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Admin panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">Jelegs Real Estate Limited</p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-background p-8 shadow-[var(--shadow-elegant)]">
          {welcomeName ? (
            <div className="flex flex-col items-center py-6 text-center animate-in fade-in zoom-in-95 duration-500">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight">Welcome, {welcomeName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Taking you to your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Sign in</h2>
                <p className="mt-1 text-sm text-muted-foreground">Enter your details to continue.</p>
              </div>

              {error && (
                <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm transition focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-11 text-sm transition focus:outline-none focus:ring-2 focus:ring-ring"
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

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:scale-[1.02] hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;