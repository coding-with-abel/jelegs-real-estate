import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const links = [
  { label: "Home", target: "home" },
  { label: "About", target: "about" },
  { label: "Projects", target: "projects" },
  { label: "Contact", target: "contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu with Escape key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleNav = (target) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/#" + target);
      setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    } else {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Backdrop behind the mobile menu */}
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <header className="fixed top-0 left-0 right-0 z-50">
  {/* Background layer: fades in and out as one piece */}
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-0 -z-10 border-b border-border/60 bg-background/85 shadow-sm backdrop-blur-md transition-opacity duration-500 ease-out ${
      scrolled || open ? "opacity-100" : "opacity-0"
    }`}
  />
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="Jelegs Real Estate" className="h-10 w-10 object-contain" />
            <span className="text-lg font-bold tracking-tight text-foreground">
              Jelegs Real Estate Limited
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <button
                key={l.target}
                onClick={() => handleNav(l.target)}
                className="text-sm font-medium text-foreground/80 transition-all duration-200 hover:scale-110 hover:text-primary active:scale-95 cursor-pointer">
                {l.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => handleNav("contact")}
            className="hidden md:inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 cursor-pointer"
>
            Get in touch
          </button>

          {/* Mobile menu toggle: icon only, rotates between menu and X */}
          <button
  onClick={() => setOpen((o) => !o)}
  className="group md:hidden relative h-10 w-10 text-foreground"
  aria-label="Toggle menu"
  aria-expanded={open}
>
  <span className="absolute inset-0 transition-transform duration-200 group-hover:scale-125 group-active:scale-75">
    <Menu
      className={`absolute inset-0 m-auto h-6 w-6 transition-all duration-300 ${
        open ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
      }`}
    />
    <X
      className={`absolute inset-0 m-auto h-6 w-6 transition-all duration-300 ${
        open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
      }`}
    />
  </span>
</button>
        </div>

        {/* Floating mobile menu panel */}
        {/* Floating mobile menu panel */}
<div
  className={`md:hidden absolute left-4 right-4 top-full mt-3 origin-top rounded-2xl border border-border bg-background/95 backdrop-blur-xl p-2 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] ${
    open
      ? "opacity-100 translate-y-0 scale-100"
      : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
  }`}
>
  {links.map((l, i) => (
    <div
      key={l.target}
      style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
      className={`transition-all duration-300 ${
        open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
      }`}
    >
      <button
        onClick={() => handleNav(l.target)}
        className="group flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-base font-medium text-foreground/90 transition-all duration-200 hover:scale-[1.03] hover:translate-x-1 hover:bg-primary/10 hover:text-primary active:scale-95 active:bg-primary/15"
      >
        {l.label}
        <span className="h-1.5 w-1.5 scale-0 rounded-full bg-primary opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-active:scale-100 group-active:opacity-100" />
      </button>
    </div>
  ))}
</div>
      </header>
    </>
  );
}