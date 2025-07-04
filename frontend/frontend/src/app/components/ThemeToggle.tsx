"use client";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      className="ml-2 px-3 py-2 rounded-lg border border-yellow-800 bg-gray-900 text-yellow-300 hover:bg-yellow-800 hover:text-white transition-colors text-xs font-bold"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Alternar tema"
      type="button"
    >
      {theme === "dark" ? "Modo Luz" : "Modo Oscuro"}
    </button>
  );
} 