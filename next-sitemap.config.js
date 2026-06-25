/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://www.hexakode.in",
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
    ],
};