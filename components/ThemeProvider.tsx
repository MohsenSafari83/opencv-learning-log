"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // The blocking script in layout.tsx's <head> already set (or didn't
    // set) the "dark" class on <html> before this ever ran — read that
    // as the source of truth instead of re-deriving it, so the two never
    // disagree.
    const isDark = document.documentElement.classList.contains("dark");
    const saved = localStorage.getItem("theme") as Theme | null;
    setTheme(saved ?? (isDark ? "dark" : "light"));
  }, []);

  // Belt-and-suspenders: re-assert the "dark" class on <html> every time
  // the route changes. This site is a static export (output: "export")
  // with nested dynamic routes ([slug]/[section]), where navigation
  // between pages doesn't always behave like a normal in-app client
  // transition — re-applying the class here means the page can never
  // render with the wrong theme after a navigation, regardless of why.
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [pathname, theme, mounted]);

  const toggleTheme = () => {
    const newTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Prevent hydration mismatch by not rendering theme-dependent UI until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: "dark", toggleTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
