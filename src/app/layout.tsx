import type { Metadata } from "next";
import { Zen_Dots, Kalam, Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ─── Font configuration ──────────────────────────────────────────────────────
//
// ALL fonts use preload:false because none are applied at the document level.
// The <body> uses Tailwind's `font-sans` which resolves to the system stack
// (no --font-family-sans is defined in @theme). Custom fonts only activate
// via utility classes (.font-body-sm, .font-headline-sm, .brand-logo, etc.)
// on individual elements. Eagerly preloading them causes the browser warning
// "preloaded but not used within a few seconds" because no above-the-fold
// CSS rule correlates to the preloaded file within the browser's timing window.
//
// With preload:false, Next.js still injects @font-face + CSS variable definitions
// and display:swap ensures text remains visible on the system font until each
// custom font file finishes loading.

const zenDots = Zen_Dots({
  variable: "--font-zen-dots",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const kalam = Kalam({
  variable: "--font-kalam",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "HexaKode | Code that powers growth",
  description:
    "Custom software, web applications, mobile apps, and digital experiences built to help businesses scale with technical precision and market-leading innovation.",
  keywords: [
    "Software Development",
    "Web App Development",
    "Mobile Apps",
    "UI/UX Design",
    "API Integrations",
    "HexaKode",
    "SaaS Platform",
    "Looking forward to engineering excellence",
  ],
  authors: [{ name: "HexaKode" }],
  openGraph: {
    title: "HexaKode | Code that powers growth",
    description:
      "Custom software, web applications, mobile apps, and digital experiences built to help businesses scale with technical precision and market-leading innovation.",
    type: "website",
    locale: "en_US",
  },
};

import { DemoModalProvider } from "@/components/common/DemoModal";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${zenDots.variable} ${kalam.variable} ${hankenGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-on-background antialiased">
        <DemoModalProvider>
          {children}
        </DemoModalProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
