import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, BedDouble, Bath, Maximize, MapPin, Leaf, Home as HomeIcon, Trees, ShieldCheck, Star, Mail, Phone, MapPinned } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader.jsx";
import { SiteFooter } from "@/components/SiteFooter.jsx";
import { Reveal } from "@/components/Reveal.jsx";
import hero from "@/assets/hero.jpg";

export default function Home() {

    const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [featured, setFeatured] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("https://jelegs-backend-cms.onrender.com/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Message sent successfully!");

        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to send message.");
    }

    setLoading(false);
  };


  useEffect(() => {
    document.title = "Jelegs Real Estate — Homes in Harmony with Nature";
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://jelegs-backend-cms.onrender.com/api/projects");
        const data = await response.json();

        if (data.success) {
          // Only show featured/published projects, limit to 3
          setFeatured(data.projects.filter(p => p.featured === true).slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      {/* HERO */}
      <section id="home" className="relative min-h-[100svh] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img src={hero} alt="Luxury home" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        </motion.div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 sm:px-8 pt-28 pb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs sm:text-sm text-white ring-1 ring-white/20"
          >
            <Leaf className="h-3.5 w-3.5" /> Sustainable luxury real estate
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
            className="mt-6 max-w-3xl text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight text-white"
          >
            Building homes that grow with you.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="mt-5 max-w-xl text-base sm:text-lg text-white/85"
          >
            A curated collection of modern residences surrounded by gardens, light and calm — designed for how you want to live.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.9 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm sm:text-base font-medium text-primary-foreground shadow-lg hover:opacity-90 transition"
            >
              Explore Projects
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-6 py-3 text-sm sm:text-base font-medium text-white ring-1 ring-white/25 hover:bg-white/20 transition"
            >
              Learn more
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9 }}
            className="mt-14 grid grid-cols-3 gap-6 max-w-lg"
          >
            {[
              { n: "20+", l: "Homes sold" },
              { n: "4.9", l: "Client rating" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl sm:text-3xl font-bold text-white">{s.n}</div>
                <div className="text-xs sm:text-sm text-white/70">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">About us</span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight">
              Rooted in excellence.<br />Built for the way you live.
            </h2>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              At Jelegs Real Estate Ltd, we develop thoughtfully planned residential communities and investment properties that combine quality construction, modern design, and lasting value.
              Every development is carefully executed to create spaces where families thrive, businesses grow, and investments appreciate. Our commitment to craftsmanship, sustainability, and integrity ensures every project is built to the highest standards.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {[
              { icon: HomeIcon, title: "Curated homes", text: "Each listing hand-picked." },
              { icon: Trees, title: "Green-first", text: "Landscape-led design." },
              { icon: ShieldCheck, title: "Trusted advisors", text: "2+ years of experience." },
              { icon: Star, title: "White-glove service", text: "From viewing to move-in." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.1}>
                <div className="rounded-2xl bg-card p-5 sm:p-6 shadow-[var(--shadow-card)] border border-border/60 h-full">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS PREVIEW */}
      <section id="projects" className="bg-secondary/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <Reveal>
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">Featured projects</span>
              <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl">
                Homes we're proud to show.
              </h2>
            </Reveal>
            <Reveal>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
              >
                View all projects <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p._id} delay={i * 0.12}>
                <article className="group overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] border border-border/60 h-full flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {p.images && p.images.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-secondary flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {p.location}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">{p.name}</h3>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/60">
                      <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4" /> {p.beds}</span>
                      <span className="flex items-center gap-1.5"><Bath className="h-4 w-4" /> {p.baths}</span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* CONTACT */}
      <section id="contact" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <div className="rounded-3xl overflow-hidden bg-[var(--gradient-primary)] shadow-[var(--shadow-elegant)]">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 sm:p-12 text-primary">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">Contact</span>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Own a home built for your future.</h2>
                  <p className="mt-4 text-primary">
                    Tell us what you want — a quiet retreat, a family home, an investment. We'll build, shortlist properties matched to your life.
                  </p>
                  <div className="mt-8 space-y-3 text-sm text-primary">
                    <div className="flex items-center gap-3"><Mail className="h-4 w-4" /> jelegsrealestate@outlook.com</div>
                    <div className="flex items-center gap-3"><MapPinned className="h-4 w-4" /> NTA Road · PortHarcourt · Rivers, Nigeria</div>
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="bg-background p-8 sm:p-12 space-y-4"
                >
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Name</label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">What are you looking for?</label>
                    <textarea rows={4} name="message" value={formData.message} onChange={handleChange} className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="A family home near the coast..." />
                  </div>
                  <button type="submit" disabled={loading} className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
                    {loading ? "Sending..." : "Send message"}
                  </button>
                </form>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}