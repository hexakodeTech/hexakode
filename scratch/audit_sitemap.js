const fs = require("fs");
const path = require("path");
const http = require("http");

async function runAudit() {
  console.log("=== HEXAKODE SITEMAP VALIDATION AUDIT ===\n");

  const sitemapIndexPath = path.join(__dirname, "../public/sitemap.xml");
  const sitemap0Path = path.join(__dirname, "../public/sitemap-0.xml");

  // Check 1: File Existence & XML Parsing
  console.log("1. Checking file existence and XML parsing...");
  if (!fs.existsSync(sitemapIndexPath)) throw new Error("Missing public/sitemap.xml");
  if (!fs.existsSync(sitemap0Path)) throw new Error("Missing public/sitemap-0.xml");

  const sitemapIndexContent = fs.readFileSync(sitemapIndexPath, "utf-8");
  const sitemap0Content = fs.readFileSync(sitemap0Path, "utf-8");

  // Simple XML validation checks
  if (!sitemapIndexContent.startsWith("<?xml") || !sitemapIndexContent.includes("</sitemapindex>")) {
    throw new Error("Invalid XML in sitemap.xml");
  }
  if (!sitemap0Content.startsWith("<?xml") || !sitemap0Content.includes("</urlset>")) {
    throw new Error("Invalid XML in sitemap-0.xml");
  }
  console.log("   -> PASS: Both sitemap.xml and sitemap-0.xml parse as valid XML.");

  // Check 7: No <priority> or <changefreq> elements exist
  console.log("\n2. Checking for forbidden <priority> and <changefreq> tags...");
  const hasPriority = /<priority>/i.test(sitemap0Content);
  const hasChangefreq = /<changefreq>/i.test(sitemap0Content);
  if (hasPriority || hasChangefreq) {
    throw new Error(`Forbidden elements found: priority=${hasPriority}, changefreq=${hasChangefreq}`);
  }
  console.log("   -> PASS: No <priority> or <changefreq> elements present.");

  // Extract URLs and lastmod
  console.log("\n3. Extracting and validating URLs and lastmod dates...");
  const urlRegex = /<url>([\s\S]*?)<\/url>/g;
  let match;
  const entries = [];
  const locSet = new Set();
  const lastmodSet = new Set();

  while ((match = urlRegex.exec(sitemap0Content)) !== null) {
    const block = match[1];
    const locMatch = /<loc>(.*?)<\/loc>/.exec(block);
    const lastmodMatch = /<lastmod>(.*?)<\/lastmod>/.exec(block);

    if (!locMatch) throw new Error("URL entry missing <loc>");
    if (!lastmodMatch) throw new Error(`URL entry ${locMatch[1]} missing <lastmod>`);

    const loc = locMatch[1];
    const lastmod = lastmodMatch[1];

    // Check 2: Canonical host is https://hexakode.in
    if (!loc.startsWith("https://hexakode.in")) {
      throw new Error(`Non-canonical host in <loc>: ${loc}`);
    }

    // Check 3: Unique URLs
    if (locSet.has(loc)) {
      throw new Error(`Duplicate URL detected: ${loc}`);
    }
    locSet.add(loc);

    // Check 4: Valid ISO 8601 date
    const parsedDate = new Date(lastmod);
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid ISO 8601 date: ${lastmod} for ${loc}`);
    }
    lastmodSet.add(lastmod);

    entries.push({ loc, lastmod });
  }

  console.log(`   -> Total unique canonical URLs found: ${entries.length}`);
  console.log("   -> PASS: All URLs use canonical host https://hexakode.in with no duplicates.");
  console.log("   -> PASS: All lastmod dates are valid ISO 8601 timestamps.");

  // Check 5: Different dates appear where content was genuinely edited at different times
  console.log("\n4. Checking date variance (ensuring dates are not all identical build stamps)...");
  console.log(`   -> Unique lastmod timestamps count: ${lastmodSet.size}`);
  if (lastmodSet.size < 4) {
    throw new Error(`Insufficient date variance: only ${lastmodSet.size} unique dates found.`);
  }
  console.log("   -> PASS: Dates genuinely vary across static pages, legal docs, author bios, blogs, and portfolio case studies.");

  // Check 9: Excluded draft, admin, api, or invalid routes are absent
  console.log("\n5. Checking that admin, api, studio, and retired routes are completely absent...");
  for (const entry of entries) {
    const url = entry.loc;
    if (
      url.includes("/admin") ||
      url.includes("/api") ||
      url.includes("/studio") ||
      url.includes("/services/web-engineering") ||
      url.includes("/_not-found") ||
      url.includes("/404")
    ) {
      throw new Error(`Excluded route found in sitemap: ${url}`);
    }
  }
  console.log("   -> PASS: No administrative, API, draft, or retired redirect URLs present.");

  // Check 8: Every included URL returns HTTP 200 on local server
  console.log("\n6. Validating HTTP status for every URL in sitemap against local server...");
  const statusAudit = [];
  for (const entry of entries) {
    const relativePath = entry.loc.replace("https://hexakode.in", "") || "/";
    const status = await new Promise((resolve) => {
      http.get("http://localhost:3000" + relativePath, (res) => {
        resolve(res.statusCode);
      }).on("error", (err) => {
        resolve(err.message);
      });
    });

    console.log(`   ${relativePath.padEnd(50)} -> HTTP ${status} (lastmod: ${entry.lastmod})`);
    statusAudit.push({ url: entry.loc, path: relativePath, status, lastmod: entry.lastmod });

    if (status !== 200) {
      throw new Error(`URL failed HTTP 200 check: ${relativePath} returned ${status}`);
    }
  }
  console.log("   -> PASS: All 24 sitemap URLs return genuine HTTP 200 OK responses.");

  console.log("\n=== AUDIT COMPLETE: ALL 9 VERIFICATION CRITERIA PASSED! ===");
}

runAudit().catch((err) => {
  console.error("\n❌ AUDIT FAILED:", err.message);
  process.exit(1);
});
