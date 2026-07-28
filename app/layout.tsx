import type { Metadata } from "next";
import { Agentation } from "agentation";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEUROPRODUCTIVO — Majo y Ronald",
  description: "Deja de procrastinar. Entiende por qué tu cerebro se bloquea y recupera el control de tus proyectos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* The checkout iframe is only created after hydration, so its DNS lookup,
            TCP connect and TLS handshake would otherwise start late. Warming the
            connection while the page is still parsing takes that cost off the
            critical path — it matters most on mobile networks in LatAm, where the
            handshake to whop.com is the slowest part of showing the embed. */}
        <link rel="preconnect" href="https://whop.com" />
        <link rel="dns-prefetch" href="https://whop.com" />
      </head>
      <body className="min-h-screen text-brand-ink antialiased">
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
