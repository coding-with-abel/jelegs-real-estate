import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Projects = () => {

    const handlePublish = async (projectId, currentStatus) => {
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
            alert(!currentStatus ? "Project published!" : "Project unpublished!");
        }

    } catch (error) {
        console.error(error);
        alert("Failed to update project");
    }
};


  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const response = await fetch("https://jelegs-backend-cms.onrender.com/api/projects");
      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://jelegs-backend-cms.onrender.com/api/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Project deleted successfully!");
        setProjects(projects.filter(p => p._id !== projectId));
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Failed to delete project");
    }
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="p-10">

      <Link 
        to="/admin/dashboard"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-8">
        Manage Projects
      </h1>

      <div className="grid gap-6">
        {
          projects.map((project) => (

            <div
              key={project._id}
              className="border rounded-xl p-6 shadow-sm"
            >

              <h2 className="text-xl font-bold">
                {project.name}
              </h2>

              <p className="text-gray-600">
                Location: {project.location}
              </p>

              <p>
                Bedrooms: {project.beds}
              </p>

              <p>
                Bathrooms: {project.baths}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate(`/admin/projects/${project._id}/edit`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(project._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>

                <button
    onClick={() => handlePublish(project._id, project.featured)}
    className={`px-4 py-2 rounded-lg ${
        project.featured
            ? "bg-gray-400 text-white hover:bg-gray-500"
            : "bg-green-600 text-white hover:bg-green-700"
    }`}
>
    {project.featured ? "Unpublish" : "Publish"}
</button>

              </div>

            </div>

          ))
        }

      </div>

    </div>
  );
};

export default Projects;