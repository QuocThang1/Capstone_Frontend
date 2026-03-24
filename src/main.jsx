import { createRoot } from "react-dom/client";
import AppRouter from "./appRouter";
import { ThemeProvider } from "./context/theme.context";
import { AuthWrapper } from "./context/auth.wrapper";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AuthWrapper>
      <AppRouter />
    </AuthWrapper>
  </ThemeProvider>
);
