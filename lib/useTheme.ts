import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      document.body.classList.add("light");
      setTheme("light");
    } else {
      document.body.classList.remove("light");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const isLight = document.body.classList.toggle("light");
    const newTheme = isLight ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return { theme, toggleTheme };
}