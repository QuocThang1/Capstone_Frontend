import React from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./appRouter";
import { ThemeProvider } from "./context/theme.context";
import { AuthWrapper } from "./context/auth.wrapper";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <ToastContainer position="bottom-right" newestOnTop />
      <ThemeProvider>
        <AuthWrapper>
          <AppRouter />
        </AuthWrapper>  
      </ThemeProvider>
  </React.StrictMode>
);
