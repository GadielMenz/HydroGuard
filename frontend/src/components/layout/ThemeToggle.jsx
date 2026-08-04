import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem("hydroguard-theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("hydroguard-theme", theme);
  }, [theme]);

  return (
    <button
      type="button"
      className="theme-toggle-enhanced"
      onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="theme-toggle-track">
        <div className={`theme-toggle-thumb ${theme}`}>
          <span className="theme-icon" aria-hidden="true">
            {theme === "dark" ? "☀️" : "🌙"}
          </span>
        </div>
      </div>
      <span className="theme-label">{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
