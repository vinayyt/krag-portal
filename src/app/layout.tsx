import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Min boligreise — Krag Gruppen",
  description:
    "Din personlige boligreise — fra første drøm til utleverte nøkler. Krag Gruppen på Sørlandet.",
  keywords: "bolig, nybygg, Kristiansand, Sørlandet, Krag, hjem",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" suppressHydrationWarning>
      <head />
      <body>{children}</body>
    </html>
  );
}
