# Mobile Image Performance Optimization Final Report

**Project:** HexaKode (`hexakode.in`)  
**Stack:** Next.js 16.2.9 (App Router), Sharp, Next.js Image Optimization, Supabase Storage/CDN  
**Audit Strategy:** Mobile (Emulated Moto G Power, 4x CPU Throttling, Slow 4G Network Throttling)  
**Report Date:** October 16, 2026  
**Environment:** Next.js Production Build (`next build` + `next start -p 3001`)  
**Status:** All four target pages verified with **zero** oversized-image warnings (`image-delivery-insight: 100% clean`, `unsized-images: 100% clean`).

---

## 1. Executive Summary

Target criteria required auditing all images across the website, eliminating PageSpeed Insights oversized-image warnings and inefficient image delivery, converting oversized PNG covers to modern WebP/AVIF formats, enforcing responsive sizing (`sizes`), eliminating unnecessary eager preloading, and preserving visual quality and existing layouts.

### Summary of Image Audit & Delivery Status Across Target Pages

| Page Route | Pre-Optimization Image Warnings | Final Image Warnings | Final Performance Score | Image Delivery Insight Status | Unsized Images Status |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Homepage** (`/`) | 1 warning (13 KiB savings on `/hero-graphics.webp`) | **0 warnings** | **94** | **100% Pass (Score 1)** | **100% Pass (Score 1)** |
| **Services** (`/services`) | 0 warnings | **0 warnings** | **89** | **100% Pass (Score 1)** | **100% Pass (Score 1)** |
| **Blog Post** (`/blog/...`) | Unoptimized PNG cover (1.82 MB raw download) | **0 warnings** | **91** | **100% Pass (Score 1)** | **100% Pass (Score 1)** |
| **Case Study** (`/portfolio/...`) | 1 warning (12 KiB savings on 1.77 MB PNG cover) | **0 warnings** | **88** | **100% Pass (Score 1)** | **100% Pass (Score 1)** |

---

## 2. Cover Images Converted to Modern WebP & AVIF

Prioritized oversized cover images hosted on Supabase Storage were processed using `sharp` into WebP variants (quality 80) and uploaded to Supabase Storage alongside existing assets (preserving original backups), and database records were updated:

| Asset / Entity | Original Format & Dimensions | Original Size | Converted Format & Dimensions | Converted Size | Reduction (%) | Storage Location |
|:---|:---|:---:|:---|:---:|:---:|:---|
| **Portfolio Cover: Revopz Website** | PNG (1672 × 941) | 1,772.5 KB | WebP (1672 × 941) | **142.0 KB** | **-92.0%** | `portfolio-assets/portfolio/revopz-website/cover/...` |
| **Blog Cover: Why We Built HexaKode** | PNG (1536 × 1024) | 1,820.5 KB | WebP (1536 × 1024) | **131.3 KB** | **-92.8%** | `portfolio-assets/blog/covers/...` |
| **Blog Cover: Business Website Cost** | PNG (1536 × 1024) | 1,986.9 KB | WebP (1536 × 1024) | **167.1 KB** | **-91.6%** | `portfolio-assets/blog/covers/...` |
| **Blog Cover: 5 Client Promises** | PNG (1536 × 1024) | 1,376.0 KB | WebP (1536 × 1024) | **37.5 KB** | **-97.3%** | `portfolio-assets/blog/covers/...` |
| **Blog Cover: UI/UX Designer** | PNG (1536 × 1024) | 1,149.5 KB | WebP (1536 × 1024) | **72.4 KB** | **-93.7%** | `portfolio-assets/blog/covers/...` |
| **Total Cover Payload** | 5 PNG Images | **8,105.4 KB** | 5 WebP Images | **550.3 KB** | **-93.2%** | **7.55 MB Bandwidth Saved** |

*Note: In production serving via Next.js Image Optimization, these assets are negotiated with the client's browser (e.g. Chrome) and delivered as sub-20 KB AVIF/WebP images with responsive source sets.*

---

## 3. Detailed Component & Image Audits

### 3.1 Homepage (`/`)
- **Hero Graphic (`src/components/home/HeroSection.tsx`):**
  - *Previous Issue:* Declared `sizes="(max-width: 768px) min(100vw - 2rem, 420px), 400px"` with `priority`. On mobile devices (viewport 412px, DPR 1.75), this requested a 750px wide image for a 330px rendered element (578 physical pixels), triggering an oversized-image warning. Additionally, eager preloading competed with H1 text rendering.
  - *Fix:* Refined `sizes="(max-width: 640px) 330px, (max-width: 1024px) 388px, 400px"`, removed `priority`, and added `loading="lazy"`. Next.js serves a clean 640w image (or 480w) perfectly matching DPR requirements without excess width.
- **Header & Footer Brand Logos (`MobileNavigation.tsx`, `DesktopNavigation.tsx`, `Footer.tsx`):**
  - Formatted as WebP with explicit container dimensions and precise `sizes="36px"` / `sizes="48px"`.
  - Added `priority` and `fetchPriority="high"` only to above-the-fold header logos.
- **Latest Insights Grid (`LatestInsights.tsx`):**
  - Refined `sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 50vw, 33vw"` with `loading="lazy"`.
- **Project Cards (`ProjectCard.tsx`):**
  - Refined `sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 50vw, 33vw"` with `loading="lazy"`.

### 3.2 Services Page (`/services`)
- **Service Cards (`ServiceCard.tsx`):**
  - *Previous Issue:* Had `priority={title === "Web Engineering"}` despite living in `CompetenciesSection` which is completely below the fold on mobile.
  - *Fix:* Removed `priority`, added `loading="lazy"`, and refined `sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 50vw, 33vw"`.

### 3.3 Blog Article (`/blog/why-we-built-hexakode`)
- **Featured Cover Image (`BlogArticleView.tsx`):**
  - *Previous Issue:* Source image was an uncompressed 1.82 MB raw PNG.
  - *Fix:* Updated database reference to verified WebP asset (`131.3 KB`). Refined `sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 48px), 800px"`. Kept `priority` and `fetchPriority="high"` because this is the primary above-the-fold content image.
- **Related Blog Cards (`RelatedBlogs.tsx`):**
  - Refined `sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 50vw, 25vw"` with `loading="lazy"`.

### 3.4 Portfolio Case Study (`/portfolio/revopz-website`)
- **Hero Cover Image (`src/app/portfolio/[slug]/page.tsx`):**
  - *Previous Issue:* 1.77 MB raw PNG.
  - *Fix:* Updated database to verified WebP asset (`142.0 KB`). Configured `quality={60}` in Next.js `qualities: [60, 75]`, reducing optimized transfer payload to just **13.1 KB** (AVIF) on mobile devices.
- **Portfolio Gallery & Lightbox (`PortfolioGallery.tsx`, `GalleryViewer.tsx`, `GalleryThumbnail.tsx`):**
  - *Previous Issue:* All three components had `unoptimized={isSupabase}`, forcing the browser to download multi-megabyte raw screenshots for every tiny 80px thumbnail and preview image. Additionally, `PortfolioGallery.tsx` had `priority={isSingle}` despite being below the fold.
  - *Fix:* Removed `unoptimized={isSupabase}` across all gallery components; removed `priority` and enforced `loading="lazy"`. Thumbnails now load at ~5 KB per thumbnail instead of 1.5 MB each.

---

## 4. Configuration & Infrastructure Changes

### 4.1 Next.js Configuration (`next.config.ts`)
- Added fine-tuned responsive device and image size breakpoints:
  ```ts
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 80, 96, 128, 256, 384],
    qualities: [60, 75],
    ...
  }
  ```
- Retained full compatibility with existing Supabase storage domain and HTTPS allowlists.

---

## 5. Verification & Test Results

### 5.1 Linting & Type Checking
- `npx tsc --noEmit`: **0 errors**.
- `npx eslint`: **0 errors, 0 warnings** across all modified files.

### 5.2 Production Build
- `npm run build`: Compiled successfully in 8.8s; all 50 static pages rendered cleanly.

### 5.3 PageSpeed / Lighthouse Mobile Verification
Audited via Lighthouse CLI with mobile device emulation (Moto G Power, 4x CPU slowdown, Slow 4G):

| Route | Lighthouse Performance Score | Image Delivery Insight | Unsized Images Audit | Oversized Image Warnings Remaining |
|:---|:---:|:---:|:---:|:---:|
| `/` | **94** | **1.0 (Pass)** | **1.0 (Pass)** | **0** |
| `/services` | **89** | **1.0 (Pass)** | **1.0 (Pass)** | **0** |
| `/blog/why-we-built-hexakode` | **91** | **1.0 (Pass)** | **1.0 (Pass)** | **0** |
| `/portfolio/revopz-website` | **88** | **1.0 (Pass)** | **1.0 (Pass)** | **0** |

---

## 6. Files Changed

| File Path | Summary of Modifications |
|:---|:---|
| [`next.config.ts`](file:///home/navaneeth/Documents/Projects/hexakode/next.config.ts) | Configured custom `deviceSizes`, `imageSizes` (including 80px thumbnail breakpoint), and allowed `qualities: [60, 75]`. |
| [`src/components/home/HeroSection.tsx`](file:///home/navaneeth/Documents/Projects/hexakode/src/components/home/HeroSection.tsx) | Refined `sizes` to eliminate mobile oversized warning; changed `priority` to `loading="lazy"`. |
| [`src/app/portfolio/[slug]/page.tsx`](file:///home/navaneeth/Documents/Projects/hexakode/src/app/portfolio/[slug]/page.tsx) | Configured `quality={60}` and refined `sizes` for the hero cover image. |
| [`src/components/blog/BlogArticleView.tsx`](file:///home/navaneeth/Documents/Projects/hexakode/src/components/blog/BlogArticleView.tsx) | Refined layout-accurate `sizes` prop for the blog article hero image. |
| [`src/components/home/LatestInsights.tsx`](file:///home/navaneeth/Documents/Projects/hexakode/src/components/home/LatestInsights.tsx) | Refined responsive `sizes` matching the 3-column card grid. |
| [`src/components/common/ProjectCard.tsx`](file:///home/navaneeth/Documents/Projects/hexakode/src/components/common/ProjectCard.tsx) | Refined responsive `sizes` matching the project grid layout. |
| [`src/components/blog/BlogCard.tsx`](file:///home/navaneeth/Documents/Projects/hexakode/src/components/blog/BlogCard.tsx) | Refined responsive `sizes` and resolved TypeScript typing. |
| [`src/components/blog/FeaturedBlog.tsx`](file:///home/navaneeth/Documents/Projects/hexakode/src/components/blog/FeaturedBlog.tsx) | Refined responsive `sizes` and resolved TypeScript typing. |
| [`src/components/blog/RelatedBlogs.tsx`](file:///home/navaneeth/Documents/Projects/hexakode/src/components/blog/RelatedBlogs.tsx) | Refined responsive `sizes` for related blog card thumbnails. |
| [`src/components/services/ServiceCard.tsx`](file:///home/navaneeth/Documents/Projects/hexakode/src/components/services/ServiceCard.tsx) | Removed eager `priority` from below-the-fold cards; added `loading="lazy"` and refined `sizes`. |
| [`src/modules/portfolio/components/public/PortfolioCard.tsx`](file:///home/navaneeth/Documents/Projects/hexakode/src/modules/portfolio/components/public/PortfolioCard.tsx) | Removed `unoptimized={isSupabase}` and `priority`; enforced `loading="lazy"` and refined `sizes`. |
| [`src/components/portfolio/PortfolioCard.tsx`](file:///home/navaneeth/Documents/Projects/hexakode/src/components/portfolio/PortfolioCard.tsx) | Removed eager `priority` and enforced `loading="lazy"`. |
| [`src/components/portfolio/FeaturedPortfolioCard.tsx`](file:///home/navaneeth/Documents/Projects/hexakode/src/components/portfolio/FeaturedPortfolioCard.tsx) | Removed eager `priority` and enforced `loading="lazy"`. |
| [`src/modules/portfolio/components/public/PortfolioGallery.tsx`](file:///home/navaneeth/Documents/Projects/hexakode/src/modules/portfolio/components/public/PortfolioGallery.tsx) | Removed eager `priority`, enforced `loading="lazy"`, and refined responsive `sizes`. |
| [`src/modules/portfolio/components/GalleryViewer.tsx`](file:///home/navaneeth/Documents/Projects/hexakode/src/modules/portfolio/components/GalleryViewer.tsx) | Removed `unoptimized={isSupabase}` to enable modern WebP/AVIF delivery. |
| [`src/modules/portfolio/components/GalleryThumbnail.tsx`](file:///home/navaneeth/Documents/Projects/hexakode/src/modules/portfolio/components/GalleryThumbnail.tsx) | Removed `unoptimized={isSupabase}` and added `sizes="80px"` for lightweight thumbnail streaming. |
