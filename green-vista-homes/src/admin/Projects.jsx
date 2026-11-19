import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff, MapPin, BedDouble, Bath, Loader2 } from "lucide-react";

const Projects = () => {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const navigate = useNavigate();

  const showNotice = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 4000);
  };

  const handlePublish = async (projectId, currentStatus) => {
    setBusyId(projectId);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://jelegs-backend-cms.onrender.com/api/projects/${projectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            featured: !currentStatus
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        setProjects(projects.map(p =>
          p._id === projectId
            ? { ...p, featured: !currentStatus }
            : p
        ));
        showNotice(!currentStatus ? "Project published." : "Project unpublished.");
      } else {
        showNotice(data.message || "Failed to update project.");
      }

    } catch (error) {
      console.error(error);
      showNotice("Failed to update project.");
    } finally {
      setBusyId(null);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("https://jelegs-backend-cms.onrender.com/api/projects");
      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error(error);
      showNotice("Couldn't load projects. The server may be waking up, so try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Projects — Jelegs Admin";
    fetchProjects();
  }, []);

  const handleDelete = async () => {
    setDeleteBusy(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://jelegs-backend-cms.onrender.com/api/projects/${deleting._id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setProjects(projects.filter(p => p._id !== deleting._id));
        showNotice("Project deleted.");
      } else {
        showNotice(data.message || "Failed to delete project.");
      }
    } catch (error) {
      console.error(error);
      showNotice("Failed to delete project.");
    } finally {
      setDeleteBusy(false);
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 text-foreground">
      <div className="mx-auto max-w-4xl px-5 py-6 sm:px-8 sm:py-12">

        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {loading ? "Loading..." : `${projects.length} total · ${projects.filter(p => p.featured).length} published`}
            </p>
          </div>
          <Link
            to="/admin/add-project"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 sm:w-auto"
          >
            <Plus className="h-4 w-4" /> Add project
          </Link>
        </div>

        {notice && (
          <div role="status" className="mt-6 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
            {notice}
          </div>
        )}

        <div className="mt-6 space-y-4 sm:mt-8">
          {loading ? (
            [0, 1, 2].map((i) => (
              <div key={i} className="flex animate-pulse flex-col gap-4 rounded-2xl border border-border/60 bg-background p-4 sm:flex-row">
                <div className="aspect-[4/3] w-full rounded-xl bg-muted sm:w-48" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-1/2 rounded bg-muted" />
                  <div className="h-4 w-1/3 rounded bg-muted" />
                  <div className="h-9 w-2/3 rounded-full bg-muted" />
                </div>
              </div>
            ))
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-background px-6 py-14 text-center">
              <p className="font-semibold">No projects yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Add your first project to show it on the website.</p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project._id}
                className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-background p-4 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-lg sm:flex-row"
              >
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-secondary sm:w-48">
                  {project.images && project.images.length > 0 ? (
                    <img src={project.images[0]} alt={project.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">No image</div>
                  )}
                  <span
                    className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-xs font-medium ${
                      project.featured ? "bg-primary text-primary-foreground" : "bg-black/60 text-white"
                    }`}
                  >
                    {project.featured ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <h2 className="truncate text-lg font-semibold">{project.name}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{project.location}</span>
                  </p>
                  <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4" /> {project.beds}</span>
                    <span className="flex items-center gap-1.5"><Bath className="h-4 w-4" /> {project.baths}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-auto sm:flex sm:flex-wrap sm:pt-4">
                    <button
                      onClick={() => handlePublish(project._id, project.featured)}
                      disabled={busyId === project._id}
                      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100 ${
                        project.featured
                          ? "border border-border bg-background hover:bg-secondary"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {busyId === project._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : project.featured ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="hidden sm:inline">{project.featured ? "Unpublish" : "Publish"}</span>
                    </button>

                    <button
                      onClick={() => navigate(`/admin/projects/${project._id}/edit`)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 hover:border-primary/40 hover:text-primary active:scale-95"
                    >
                      <Pencil className="h-4 w-4" /> <span className="hidden sm:inline">Edit</span>
                    </button>

                    <button
                      onClick={() => setDeleting(project)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-red-700 active:scale-95"
                    >
                      <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

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
            <h2 className="mt-4 text-xl font-bold tracking-tight">Delete project?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {deleting.name} will be removed from the website. This can't be undone.
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

export default Projects;