"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import AnalyticsTracker from "./AnalyticsTracker";

/**
 * Determines whether a given pathname belongs to the admin panel.
 * Matches /admin, /admin/, and any /admin/* subroutes.
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

const rawGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-KF1P37M1E4";
const GA_ID = rawGaId.replace(/['"]/g, "").trim();

export default function AnalyticsProvider() {
  const pathname = usePathname();

  const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  // Hard stop: do not render anything for admin routes or local testing.
  if (!GA_ID || isAdminRoute(pathname) || isLocal) {
    return null;
  }

  return (
    <>
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <AnalyticsTracker />
    </>
  );
}
