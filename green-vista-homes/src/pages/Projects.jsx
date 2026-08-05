import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, BedDouble, Bath, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader.jsx";
import { SiteFooter } from "@/components/SiteFooter.jsx";
import { Reveal } from "@/components/Reveal.jsx";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Projects — Verdant Estates";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://jelegs-backend-cms.onrender.com/api/projects");
        const data = await response.json();

        if (data.success) {
          // Only show featured/published projects
          setProjects(data.projects.filter(p => p.featured === true));
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="bg-background text-foreground">
        <SiteHeader />
        <div className="pt-32 pb-32 text-center">
          <p>Loading projects...</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <section className="pt-32 sm:pt-40 pb-12 sm:pb-16 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition">
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
            <span className="mt-6 block text-sm font-semibold uppercase tracking-widest text-primary">Projects</span>
            <h1 className="mt-2 text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl">
              Homes worth coming home to.
            </h1>
            <p className="mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground">
              A hand-picked selection of residences across the state. Each one chosen for its light, its landscape and its long-term value.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 space-y-16 sm:space-y-24">
          {projects.length === 0 ? (
            <p className="text-center text-muted-foreground">No projects published yet.</p>
          ) : (
            projects.map((p, i) => (
              <Reveal key={p._id}>
                <article className={`grid gap-8 md:gap-12 md:grid-cols-2 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-elegant)]">
                    {p.images && p.images.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                        className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] bg-secondary flex items-center justify-center">
                        <span className="text-muted-foreground">No image available</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {p.location}
                    </div>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">{p.name}</h2>
                    <p className="mt-5 text-base text-muted-foreground leading-relaxed">{p.description}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm"><BedDouble className="h-4 w-4 text-primary" /> {p.beds} bedrooms</span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm"><Bath className="h-4 w-4 text-primary" /> {p.baths} bathrooms</span>
                      {p.features && p.features.length > 0 && (
                        p.features.map((feature, idx) => (
                          <span key={idx} className="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm">
                            {feature}
                          </span>
                        ))
                      )}
                    </div>
                    <Link
                      to="/#contact"
                      className="mt-8 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 transition"
                    >
                      Enquire about this home
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}