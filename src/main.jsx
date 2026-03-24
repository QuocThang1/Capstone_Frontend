import { createRoot } from "react-dom/client";
import Home from "./pages/home";
import { ThemeProvider } from "./context/theme.context";
import { AuthWrapper } from "./context/auth.wrapper";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AuthWrapper>
      <Home />
    </AuthWrapper>
  </ThemeProvider>
);
