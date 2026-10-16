/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('next-sitemap').IConfig} */

// Static & editorial page content modification timestamps (ISO 8601 UTC)
// Sourced from git commit history of genuine content and metadata changes
const STATIC_PAGE_LASTMOD = {
  "/": "2026-10-15T12:11:48.000Z",
  "/about": "2026-10-15T13:47:14.000Z",
  "/contact": "2026-10-15T13:47:14.000Z",
  "/services": "2026-10-15T12:11:48.000Z",
  "/services/web-development": "2026-10-15T12:11:48.000Z",
  "/services/mobile-app-development": "2026-10-15T12:11:48.000Z",
  "/services/ui-ux-design": "2026-10-15T12:11:48.000Z",
  "/services/digital-marketing": "2026-10-15T12:11:48.000Z",
  "/portfolio": "2026-10-15T12:11:48.000Z",
  "/blog": "2026-10-15T12:11:48.000Z",
  "/careers": "2026-10-14T16:52:27.000Z",
  "/privacy-policy": "2026-10-14T16:52:27.000Z",
  "/terms-of-service": "2026-10-14T16:52:27.000Z",
  "/cookie-policy": "2026-10-14T16:52:27.000Z",
  "/blog/authors/navaneeth-pp": "2026-10-15T14:31:16.000Z",
  "/blog/authors/prajosh-c": "2026-10-15T14:31:16.000Z",
  "/blog/authors/prajith": "2026-10-15T14:31:16.000Z",
};

// Verified content timestamps for dynamic content (fallback & baseline)
// Note: For blog posts, publishedAt is used because updatedAt in Prisma is
// automatically updated by the runtime view counter (incrementBlogViews).
const DYNAMIC_FALLBACK_LASTMOD = {
  "/portfolio/revopz-internal-management-system": "2026-10-15T11:54:04.916Z",
  "/portfolio/revopz-website": "2026-10-15T11:54:05.394Z",
  "/blog/web-engineering-a-complete-guide-to-building-modern-scalable-web-applications": "2026-08-16T12:41:21.047Z",
  "/blog/how-much-does-a-business-website-cost-in-kerala": "2026-07-27T06:55:37.892Z",
  "/blog/hexakode-5-client-promises": "2026-10-14T03:09:17.817Z",
  "/blog/what-is-ui-ux-designer": "2026-08-04T04:42:28.352Z",
  "/blog/why-we-built-hexakode": "2026-10-14T03:18:39.957Z",
};

let cachedDynamicDates = null;

async function fetchDynamicDates() {
  if (cachedDynamicDates) return cachedDynamicDates;
  const dates = { ...DYNAMIC_FALLBACK_LASTMOD };

  const connStr = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (connStr) {
    try {
      const { Pool } = require("pg");
      const pool = new Pool({ connectionString: connStr, connectionTimeoutMillis: 5000 });
      
      // Use verified publishedAt for blogs to avoid view-count mutation churn
      const blogRes = await pool.query(
        'SELECT slug, "publishedAt" FROM blogs WHERE status = \'PUBLISHED\''
      );
      for (const row of blogRes.rows) {
        if (row.publishedAt) {
          dates[`/blog/${row.slug}`] = new Date(row.publishedAt).toISOString();
        }
      }

      // Portfolio project content modification timestamp
      const portRes = await pool.query(
        'SELECT slug, "updatedAt", "publishedAt" FROM portfolio_projects WHERE status = \'Published\''
      );
      for (const row of portRes.rows) {
        const dt = row.updatedAt || row.publishedAt;
        if (dt) dates[`/portfolio/${row.slug}`] = new Date(dt).toISOString();
      }
      await pool.end();
    } catch {
      // Fallback remains active if database query fails or during offline build
    }
  }

  cachedDynamicDates = dates;
  return dates;
}

module.exports = {
  siteUrl: "https://hexakode.in",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  autoLastmod: false,
  exclude: [
    "/admin",
    "/admin/*",
    "/studio",
    "/studio/*",
    "/api/*",
    "/services/web-engineering",
    "/services/web-engineering/*",
    "/_not-found",
    "/404",
  ],
  transform: async (config, loc) => {
    const cleanPath = loc.startsWith("/") ? loc : `/${loc}`;

    // Disallow admin, api, studio, internal or retired paths
    if (
      cleanPath.startsWith("/admin") ||
      cleanPath.startsWith("/api") ||
      cleanPath.startsWith("/studio") ||
      cleanPath.startsWith("/_") ||
      cleanPath.startsWith("/services/web-engineering")
    ) {
      return null;
    }

    // Static dates
    if (STATIC_PAGE_LASTMOD[cleanPath]) {
      return {
        loc: cleanPath,
        lastmod: STATIC_PAGE_LASTMOD[cleanPath],
      };
    }

    // Dynamic dates (from DB or fallback)
    const dynamicDates = await fetchDynamicDates();
    if (dynamicDates[cleanPath]) {
      return {
        loc: cleanPath,
        lastmod: dynamicDates[cleanPath],
      };
    }

    // Exclude any unrecognized paths to keep sitemap strictly canonical
    return null;
  },
  additionalPaths: async () => {
    // /blog is a server-rendered dynamic listing route not discovered by default prerender scanner
    return [
      {
        loc: "/blog",
        lastmod: STATIC_PAGE_LASTMOD["/blog"],
      },
    ];
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/studio/", "/api/"],
      },
    ],
    additionalSitemaps: [],
  },
};