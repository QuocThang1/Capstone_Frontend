import { useContext } from "react";

const useDarkMode = () => {
  // Check if dark mode is enabled by looking at document/body classes
  const isDark = document.documentElement.classList.contains("dark");

  const toggle = () => {
    const html = document.documentElement;
    const body = document.body;

    if (isDark) {
      html.classList.remove("dark");
      body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    // Trigger a re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent("themechange"));
  };

  return { isDark, toggle };
};

export default useDarkMode;
