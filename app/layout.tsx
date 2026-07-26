import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEUROPRODUCTIVO — Majo y Ronald",
  description: "Deja de procrastinar. Entiende por qué tu cerebro se bloquea y recupera el control de tus proyectos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen text-brand-ink antialiased">{children}</body>
    </html>
  );
}
