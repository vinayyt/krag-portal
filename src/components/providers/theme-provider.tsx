"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Brand = "warm" | "navy" | "clay";
type Headings = "serif" | "sans";

interface ThemeContextValue {
  brand: Brand;
  setBrand: (b: Brand) => void;
  headings: Headings;
  setHeadings: (h: Headings) => void;
  radius: number;
  setRadius: (r: number) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<Brand>("warm");
  const [headings, setHeadings] = useState<Headings>("serif");
  const [radius, setRadius] = useState(16);

  // Apply to <html> so CSS vars take effect everywhere
  useEffect(() => {
    document.documentElement.setAttribute("data-brand", brand);
  }, [brand]);

  useEffect(() => {
    document.documentElement.style.setProperty("--radius", `${radius}px`);
  }, [radius]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-serif",
      headings === "sans"
        ? '"Schibsted Grotesk", sans-serif'
        : '"Newsreader", Georgia, serif'
    );
  }, [headings]);

  return (
    <ThemeContext.Provider
      value={{ brand, setBrand, headings, setHeadings, radius, setRadius }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
