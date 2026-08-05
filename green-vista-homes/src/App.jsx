import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import AdminLogin from "./admin/AdminLogin";
import DashBoard from "./admin/DashBoard";
import AddProject from "./admin/AddProject";
import ProjectsManage from "./admin/Projects";
import EditProject from "./admin/EditProject";
import RegisterAdmin from "./admin/RegisterAdmin";
import ManageAdmins from "./admin/ManageAdmins";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<DashBoard />} />
      <Route path="/admin/add-project" element={<AddProject />} />
      <Route path="/admin/projects" element={<ProjectsManage />} />
      <Route path="/admin/projects/:id/edit" element={<EditProject />} />
      <Route path="/admin/register-admin" element={<RegisterAdmin />} />
      <Route path="/admin/manage-admins" element={<ManageAdmins />} />
    </Routes>
  );
}