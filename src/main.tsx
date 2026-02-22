import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "../index.css";

// Admin imports
import AdminLogin from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import Skills from "./admin/pages/Skills";
import Experiences from "./admin/pages/Experiences";
import Projects from "./admin/pages/Projects";
import Contact from "./admin/pages/Contact";
import AuthGuard from "./admin/components/AuthGuard";
import ToastContainer from "./admin/components/ToastContainer";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public Portfolio Route */}
        <Route path="/" element={<App />} />

        {/* Admin Login Route */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/skills"
          element={
            <AuthGuard>
              <Skills />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/experiences"
          element={
            <AuthGuard>
              <Experiences />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <AuthGuard>
              <Projects />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/contact"
          element={
            <AuthGuard>
              <Contact />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
