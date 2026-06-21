import type { Metadata } from "next";
import { Geist, Geist_Mono, Zen_Dots, Kalam, Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const zenDots = Zen_Dots({
  variable: "--font-zen-dots",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const kalam = Kalam({
  variable: "--font-kalam",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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
      className={`${geistSans.variable} ${geistMono.variable} ${zenDots.variable} ${kalam.variable} ${hankenGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
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
