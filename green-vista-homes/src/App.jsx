import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import AddProject from "./admin/AddProject";
import ProjectsManage from "./admin/Projects.jsx";
import EditProject from "./admin/EditProject.jsx";
import RegisterAdmin from "./admin/RegisterAdmin.jsx";
import ManageAdmins from "./admin/ManageAdmins.jsx";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/add-project" element={<AddProject />} />
      <Route path="/admin/projects" element={<ProjectsManage />} />
      <Route path="/admin/projects/:id/edit" element={<EditProject />} />
      <Route path="/admin/register-admin" element={<RegisterAdmin />} />
      <Route path="/admin/manage-admins" element={<ManageAdmins />} />
    </Routes>
  );
}