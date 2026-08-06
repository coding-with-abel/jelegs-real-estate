import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, BedDouble, Bath, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader.jsx";
import { SiteFooter } from "@/components/SiteFooter.jsx";
import { Reveal } from "@/components/Reveal.jsx";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

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
          setProjects(data.projects.filter(p => p.featured === true));
          const indexes = {};
          data.projects.forEach(p => {
            indexes[p._id] = 0;
          });
          setCurrentImageIndex(indexes);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handlePrevImage = (projectId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [projectId]: prev[projectId] === 0 ? totalImages - 1 : prev[projectId] - 1
    }));
  };

  const handleNextImage = (projectId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [projectId]: prev[projectId] === totalImages - 1 ? 0 : prev[projectId] + 1
    }));
  };

  const handleDotClick = (projectId, index) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [projectId]: index
    }));
  };

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
            projects.map((p, i) => {
              const currentIndex = currentImageIndex[p._id] || 0;
              const totalImages = p.images?.length || 0;

              return (
                <Reveal key={p._id}>
                  <article className={`grid gap-8 md:gap-12 md:grid-cols-2 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                    {/* Image Carousel */}
                    <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-elegant)]">
                      {p.images && p.images.length > 0 ? (
                        <div className="relative w-full">
                          <img
                            src={p.images[currentIndex]}
                            alt={p.name}
                            loading="lazy"
                            className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
                          />

                          {/* Prev/Next Buttons - Mobile & Desktop */}
                          {totalImages > 1 && (
                            <>
                              <button
                                onClick={() => handlePrevImage(p._id, totalImages)}
                                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition"
                                aria-label="Previous image"
                              >
                                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                              </button>
                              <button
                                onClick={() => handleNextImage(p._id, totalImages)}
                                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition"
                                aria-label="Next image"
                              >
                                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                              </button>
                            </>
                          )}

                          {/* Dots Indicator - Mobile & Desktop */}
                          {totalImages > 1 && (
                            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                              {p.images.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleDotClick(p._id, idx)}
                                  className={`rounded-full transition ${
                                    idx === currentIndex
                                      ? "w-5 sm:w-6 h-2 bg-white"
                                      : "w-2 h-2 bg-white/50 hover:bg-white/70"
                                  }`}
                                  aria-label={`Go to image ${idx + 1}`}
                                />
                              ))}
                            </div>
                          )}

                          {/* Image Counter - Mobile & Desktop */}
                          {totalImages > 1 && (
                            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                              {currentIndex + 1} / {totalImages}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full aspect-[4/3] bg-secondary flex items-center justify-center">
                          <span className="text-muted-foreground">No image available</span>
                        </div>
                      )}
                    </div>

                    {/* Project Details */}
                    <div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {p.location}
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
              );
            })
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}