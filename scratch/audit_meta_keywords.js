const http = require("http");

const routes = [
  "/",
  "/about",
  "/blog",
  "/blog/authors/navaneeth-pp",
  "/blog/authors/prajith",
  "/blog/authors/prajosh-c",
  "/blog/hexakode-5-client-promises",
  "/blog/how-much-does-a-business-website-cost-in-kerala",
  "/blog/web-engineering-a-complete-guide-to-building-modern-scalable-web-applications",
  "/blog/what-is-ui-ux-designer",
  "/blog/why-we-built-hexakode",
  "/careers",
  "/contact",
  "/cookie-policy",
  "/portfolio",
  "/portfolio/revopz-internal-management-system",
  "/portfolio/revopz-website",
  "/privacy-policy",
  "/services",
  "/services/digital-marketing",
  "/services/mobile-app-development",
  "/services/ui-ux-design",
  "/services/web-development",
  "/terms-of-service",
  "/some-unknown-page-for-404-audit"
];

function fetchRoute(route) {
  return new Promise((resolve, reject) => {
    http.get("http://localhost:3000" + route, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve({ route, status: res.statusCode, html: data }));
    }).on("error", reject);
  });
}

async function runAudit() {
  console.log("=== AUDITING META KEYWORDS ACROSS ALL ROUTES ===\n");
  let failed = false;

  for (const route of routes) {
    const res = await fetchRoute(route);
    const html = res.html;

    // Check 1: Meta keywords tag
    // Match any <meta ...> tag that has name="keywords" or name='keywords' in any attribute order
    const metaKeywordsRegex = /<meta\s+[^>]*name\s*=\s*["']keywords["'][^>]*>/i;
    const metaKeywordsMatch = html.match(metaKeywordsRegex);

    // Also check generic keywords match in <head>
    const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
    const headContent = headMatch ? headMatch[0] : "";
    const headHasKeywordsMeta = /keywords/i.test(headContent) && /<meta[^>]+keywords/i.test(headContent);

    // Check 2: Stray phrase "Looking forward to engineering excellence"
    const strayPhraseRegex = /Looking forward to engineering excellence/i;
    const strayPhraseInMeta = strayPhraseRegex.test(headContent);

    // Check 3: Essential metadata preserved
    const hasTitle = /<title[^>]*>[^<]+<\/title>/i.test(html);
    const hasCanonical = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html);
    const hasDesc = /<meta\s+[^>]*name=["']description["'][^>]*>/i.test(html);
    const hasOgTitle = /<meta\s+[^>]*property=["']og:title["'][^>]*>/i.test(html);

    if (metaKeywordsMatch) {
      console.error(`❌ [FAIL] ${route}: Found <meta name="keywords">: ${metaKeywordsMatch[0]}`);
      failed = true;
    } else if (headHasKeywordsMeta) {
      console.error(`❌ [FAIL] ${route}: Found keywords meta in <head>`);
      failed = true;
    } else if (strayPhraseInMeta) {
      console.error(`❌ [FAIL] ${route}: Found stray phrase in <head> meta!`);
      failed = true;
    } else {
      console.log(`✅ [PASS] ${route} (status: ${res.status}) - Zero meta keywords. Essential SEO: title=${hasTitle}, desc=${hasDesc}, canonical=${hasCanonical}, og:title=${hasOgTitle}`);
    }
  }

  if (failed) {
    console.error("\nAudit failed: meta keywords found.");
    process.exit(1);
  } else {
    console.log("\n🎉 ALL ROUTES PASSED! Exactly ZERO <meta name=\"keywords\"> tags found across all routes.");
  }
}

runAudit().catch(err => {
  console.error("Audit error:", err);
  process.exit(1);
});
