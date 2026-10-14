/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://hexakode.in",
    generateRobotsTxt: true,
    sitemapSize: 7000,
    changefreq: "weekly",
    priority: 0.7,
    exclude: [
        "/admin",
        "/admin/*",
        "/studio",
        "/studio/*",
        "/api/*",
        "/services/web-engineering",
        "/services/web-engineering/*",
    ],
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