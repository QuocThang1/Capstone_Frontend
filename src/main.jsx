import React from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppRouter from "./appRouter";
import { ThemeProvider } from "./context/theme.context";
import { AuthWrapper } from "./context/auth.wrapper";
import { ProjectProvider } from './context/project.wrapper.jsx';
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your_google_client_id_here";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ToastContainer position="top-right" newestOnTop />
      <ThemeProvider>
        <AuthWrapper>
          <ProjectProvider>
            <AppRouter />
          </ProjectProvider>
        </AuthWrapper>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
