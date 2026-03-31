import { useState, useEffect } from "react";

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage or DOM
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return document.documentElement.classList.contains("dark");
  });

  // Listen for custom theme change events
  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    window.addEventListener("themechange", handleThemeChange);
    return () => window.removeEventListener("themechange", handleThemeChange);
  }, []);

  const toggle = () => {
    const html = document.documentElement;

    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return { isDark, toggle };
};

export default useDarkMode;
