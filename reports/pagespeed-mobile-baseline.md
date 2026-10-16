# PageSpeed Insights Mobile Baseline Audit Report

**Date:** 2026-10-16  
**Auditor:** HexaKode Engineering Agent  
**Tool:** Google PageSpeed Insights (Mobile Strategy) via Chrome User Experience & Lighthouse Engine  
**Project:** HexaKode (`https://hexakode.in`)  
**Form Factor:** Mobile (simulated Moto G Power / Slow 4G mobile emulation)

---

## 1. Executive Summary

A comprehensive baseline mobile performance audit was conducted across four representative canonical URLs:
1. **Homepage:** `https://hexakode.in/`
2. **Services Page:** `https://hexakode.in/services`
3. **Blog Post:** `https://hexakode.in/blog/why-we-built-hexakode`
4. **Portfolio Case Study:** `https://hexakode.in/portfolio/revopz-website`

All four URLs are valid canonical routes on `https://hexakode.in`.

### Baseline Metrics Summary Table

| Page | Performance Score | FCP | LCP | TBT | CLS | Speed Index | CrUX Field Data |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Homepage** (`/`) | **68** | 3.6 s | 5.3 s | 150 ms | 0.00 | 5.0 s | No Data / Unavailable |
| **Services** (`/services`) | **79** | 1.4 s | 5.5 s | 80 ms | 0.00 | 2.8 s | No Data / Unavailable |
| **Blog Post** (`/blog/...`) | **73** | 3.1 s | 5.6 s | 80 ms | 0.00 | 3.1 s | No Data / Unavailable |
| **Case Study** (`/portfolio/...`) | **65** | 3.1 s | 14.5 s | 70 ms | 0.00 | 5.4 s | No Data / Unavailable |

*Note on CrUX Field Data:* For all tested URLs and origin, Google PageSpeed Insights reports "No Data / Unavailable" because the domain does not currently have sufficient real-world user traffic over the previous 28-day window to meet the CrUX inclusion threshold. In accordance with Google CWV auditing standards, field INP/LCP/CLS cannot be claimed as passed or failed, and must be recorded as unavailable.

---

## 2. Detailed Page Breakdowns

### 2.1 Homepage (`https://hexakode.in/`)
- **Performance Score:** 68 / 100
- **First Contentful Paint (FCP):** 3.6 s
- **Largest Contentful Paint (LCP):** 5.3 s
- **Total Blocking Time (TBT):** 150 ms
- **Cumulative Layout Shift (CLS):** 0
- **Speed Index:** 5.0 s
- **LCP Element:** Hero title / subheading text block
- **Primary Bottlenecks & Opportunities:**
  1. **Render-blocking CSS/JS:** ~450 ms delay caused by synchronous stylesheet imports and font loading.
  2. **Unused JavaScript:** ~155 KiB of unused client-side JS bundles.
  3. **Main-Thread Tasks:** 4 long main-thread tasks contributing to initial delay and TBT.
  4. **Font Loading & Reflow:** FOUT / font swap overhead impacting FCP and LCP text rendering.

### 2.2 Services Page (`https://hexakode.in/services`)
- **Performance Score:** 79 / 100
- **First Contentful Paint (FCP):** 1.4 s
- **Largest Contentful Paint (LCP):** 5.5 s
- **Total Blocking Time (TBT):** 80 ms
- **Cumulative Layout Shift (CLS):** 0
- **Speed Index:** 2.8 s
- **LCP Element:** `<p class="font-body-lg ...">` in Services Hero section
- **Primary Bottlenecks & Opportunities:**
  1. **Render-blocking Resources:** ~450 ms stylesheet/font initialization.
  2. **Unused JavaScript:** ~155 KiB of bundle payload loaded upfront.
  3. **Heavy Client Island Hydration:** Non-critical below-the-fold sections hydrated synchronously on mobile.

### 2.3 Blog Article (`https://hexakode.in/blog/why-we-built-hexakode`)
- **Performance Score:** 73 / 100
- **First Contentful Paint (FCP):** 3.1 s
- **Largest Contentful Paint (LCP):** 5.6 s
- **Total Blocking Time (TBT):** 80 ms
- **Cumulative Layout Shift (CLS):** 0
- **Speed Index:** 3.1 s
- **LCP Element:** Hero banner image (`<img alt="Why We Built HexaKode..." ...>`)
- **LCP Breakdown:**
  - Time to First Byte (TTFB): 10 ms
  - Resource Load Delay: 140 ms
  - **Resource Load Duration:** **3,330 ms** (Critical Bottleneck)
  - Element Render Delay: 10 ms
- **Primary Bottlenecks & Opportunities:**
  1. **Hero Image Transfer:** Unoptimized image resolution and format causing a 3.3s download phase on mobile 4G.
  2. **Missing Preload / Priority:** Image is not preloaded with `fetchPriority="high"`.
  3. **Render-blocking Requests:** ~450 ms.

### 2.4 Portfolio Case Study (`https://hexakode.in/portfolio/revopz-website`)
- **Performance Score:** 65 / 100
- **First Contentful Paint (FCP):** 3.1 s
- **Largest Contentful Paint (LCP):** 14.5 s (Severe Bottleneck)
- **Total Blocking Time (TBT):** 70 ms
- **Cumulative Layout Shift (CLS):** 0
- **Speed Index:** 5.4 s
- **LCP Element:** Project cover image banner
- **Primary Bottlenecks & Opportunities:**
  1. **Massive Hero Image:** Estimated potential savings of **1,516 KiB** on the cover image! The raw unoptimized image is served directly from Supabase Storage without responsive resizing or modern WebP/AVIF compression.
  2. **Render-blocking Requests:** ~450 ms.
  3. **Cache-Control Headers:** Supabase storage asset lacked long-lived immutable caching (~1,429 KiB).
  4. **Unused JavaScript:** ~124 KiB.

---

## 3. Targeted Root Causes Identified for Remediation

1. **Massive Hero & Banner Images (LCP Disaster on Mobile):**
   - In case studies and blog posts, full-resolution PNG/WebP images (>1.5MB) are loaded without `sizes`, `priority`, or responsive dimensions.
   - Using Next.js Image or responsive picture with WebP/AVIF and proper sizing will slash image payloads by 85–95%.
2. **Font Loading & Preconnect:**
   - Fonts from Google Fonts (`JetBrains_Mono` and `Inter`) need optimal preloading and `display: "swap"`.
3. **Render-Blocking CSS & JS Bundle Bloat:**
   - Client components that are below the fold (e.g. interactive FAQ accordions, testimonials carousels, CTA review components) are bundled into the initial client chunk instead of being dynamically imported with `ssr: true` or lazy-hydrated.
4. **Third-Party / Unused Client Libraries:**
   - Lucide icons or Framer Motion variants causing bundle overhead.
   - Next.js dynamic imports with appropriate viewport/interaction triggers.
