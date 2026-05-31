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
    const newIsDark = !isDark;

    // Update DOM ngay lập tức để tất cả component sync
    if (newIsDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // Update state và dispatch event
    setIsDark(newIsDark);
    
    // Dispatch event để các component khác lắng nghe
    setTimeout(() => {
      window.dispatchEvent(new Event("themechange"));
    }, 0);
  };

  return { isDark, toggle };
};

export default useDarkMode;
