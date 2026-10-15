const http = require("http");

const routes = [
  "/",
  "/about",
  "/contact",
  "/careers",
  "/services",
  "/services/web-development",
  "/services/mobile-app-development",
  "/services/ui-ux-design",
  "/services/digital-marketing",
  "/portfolio",
  "/portfolio/revopz-internal-management-system",
  "/portfolio/revopz-website",
  "/blog",
  "/blog/hexakode-5-client-promises",
  "/blog/how-much-does-a-business-website-cost-in-kerala",
  "/blog/web-engineering-a-complete-guide-to-building-modern-scalable-web-applications",
  "/blog/what-is-ui-ux-designer",
  "/blog/why-we-built-hexakode",
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy"
];

function fetchRoute(route) {
  return new Promise((resolve, reject) => {
    http.get("http://localhost:3009" + route, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve({ route, status: res.statusCode, html: data }));
    }).on("error", reject);
  });
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function extractMeta(html) {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1] : "";
  const title = decodeHtmlEntities(rawTitle);

  const descMatch = html.match(/<meta[^>]*name=["\x27]description["\x27][^>]*content=["\x27]([^"\x27]*)["\x27]/i)
    || html.match(/<meta[^>]*content=["\x27]([^"\x27]*)["\x27][^>]*name=["\x27]description["\x27]/i);
  const rawDesc = descMatch ? descMatch[1] : "";
  const desc = decodeHtmlEntities(rawDesc);

  const ogTitleMatch = html.match(/<meta[^>]*property=["\x27]og:title["\x27][^>]*content=["\x27]([^"\x27]*)["\x27]/i);
  const ogDescMatch = html.match(/<meta[^>]*property=["\x27]og:description["\x27][^>]*content=["\x27]([^"\x27]*)["\x27]/i);
  const ogUrlMatch = html.match(/<meta[^>]*property=["\x27]og:url["\x27][^>]*content=["\x27]([^"\x27]*)["\x27]/i);
  const ogImageMatch = html.match(/<meta[^>]*property=["\x27]og:image["\x27][^>]*content=["\x27]([^"\x27]*)["\x27]/i);

  const twCardMatch = html.match(/<meta[^>]*name=["\x27]twitter:card["\x27][^>]*content=["\x27]([^"\x27]*)["\x27]/i);
  const twTitleMatch = html.match(/<meta[^>]*name=["\x27]twitter:title["\x27][^>]*content=["\x27]([^"\x27]*)["\x27]/i);
  const twDescMatch = html.match(/<meta[^>]*name=["\x27]twitter:description["\x27][^>]*content=["\x27]([^"\x27]*)["\x27]/i);

  const canMatch = html.match(/<link[^>]*rel=["\x27]canonical["\x27][^>]*href=["\x27]([^"\x27]*)["\x27]/i);

  // Extract JSON-LD scripts
  const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["\x27]application\/ld\+json["\x27][^>]*>([\s\S]*?)<\/script>/gi)];
  const jsonLdTypes = [];
  for (const m of jsonLdMatches) {
    try {
      const parsed = JSON.parse(m[1]);
      if (parsed["@graph"]) {
        parsed["@graph"].forEach(g => jsonLdTypes.push(g["@type"]));
      } else if (parsed["@type"]) {
        jsonLdTypes.push(parsed["@type"]);
      }
    } catch (e) {}
  }

  return {
    rawTitle,
    title,
    rawDesc,
    desc,
    ogTitle: ogTitleMatch ? decodeHtmlEntities(ogTitleMatch[1]) : "",
    ogDesc: ogDescMatch ? decodeHtmlEntities(ogDescMatch[1]) : "",
    ogUrl: ogUrlMatch ? ogUrlMatch[1] : "",
    ogImage: ogImageMatch ? ogImageMatch[1] : "",
    twCard: twCardMatch ? twCardMatch[1] : "",
    twTitle: twTitleMatch ? decodeHtmlEntities(twTitleMatch[1]) : "",
    twDesc: twDescMatch ? decodeHtmlEntities(twDescMatch[1]) : "",
    canonical: canMatch ? canMatch[1] : "",
    jsonLdTypes: jsonLdTypes.flat()
  };
}

async function run() {
  console.log("================================================================================");
  console.log("HEXAKODE SITEWIDE SEO METADATA AUDIT REPORT (PORT 3009)");
  console.log("Strict Limits: Title <= 59 characters, Description <= 159 characters");
  console.log("Canonical: https://hexakode.in (non-www)");
  console.log("================================================================================\n");

  let totalRoutes = 0;
  let passedRoutes = 0;
  let failedRoutes = 0;
  const table = [];

  for (const r of routes) {
    totalRoutes++;
    const res = await fetchRoute(r);
    const m = extractMeta(res.html);

    const titleLen = m.title.length;
    const descLen = m.desc.length;
    const rawTitleLen = m.rawTitle.length;
    const rawDescLen = m.rawDesc.length;

    // Strict checks: <= 59 for title, <= 159 for description
    const titleValid = titleLen > 0 && titleLen <= 59 && rawTitleLen <= 59;
    const descValid = descLen > 0 && descLen <= 159 && rawDescLen <= 159;
    const canonicalValid = m.canonical.startsWith("https://hexakode.in") && !m.canonical.includes("www.hexakode.in");
    const ogValid = m.ogTitle.length > 0 && m.ogDesc.length > 0 && m.ogUrl.startsWith("https://hexakode.in") && m.ogImage.startsWith("https://");
    const twValid = m.twCard === "summary_large_image" && m.twTitle.length > 0;

    const pass = res.status === 200 && titleValid && descValid && canonicalValid && ogValid && twValid;

    if (pass) passedRoutes++;
    else failedRoutes++;

    table.push({
      route: r,
      status: res.status,
      title: m.title,
      titleLen,
      rawTitleLen,
      desc: m.desc,
      descLen,
      rawDescLen,
      canonical: m.canonical,
      ogTitle: m.ogTitle,
      jsonLd: m.jsonLdTypes.join(", "),
      pass
    });

    console.log(`Route: ${r} [HTTP ${res.status}] -> ${pass ? "PASS" : "FAIL"}`);
    console.log(`  Title (${titleLen} ch, raw ${rawTitleLen} ch) [${titleValid ? "PASS" : "FAIL"}]: "${m.title}"`);
    console.log(`  Desc  (${descLen} ch, raw ${rawDescLen} ch) [${descValid ? "PASS" : "FAIL"}]: "${m.desc}"`);
    console.log(`  Canonical: ${m.canonical} [${canonicalValid ? "PASS" : "FAIL"}]`);
    console.log(`  OG URL: ${m.ogUrl} | OG Image: ${m.ogImage}`);
    console.log(`  JSON-LD Entities: ${m.jsonLdTypes.join(", ")}`);
    if (!pass) {
      console.log(`  >>> VIOLATION: titleValid=${titleValid}, descValid=${descValid}, canonicalValid=${canonicalValid}, ogValid=${ogValid}`);
    }
    console.log("");
  }

  console.log("================================================================================");
  console.log(`SUMMARY: Total Audited: ${totalRoutes} | Passed: ${passedRoutes} | Failed: ${failedRoutes}`);
  console.log("================================================================================");

  // Homepage Specific Assertions
  const home = table.find(t => t.route === "/");
  console.log("\nHOMEPAGE AUDIT DETAILS:");
  console.log(`- Title: "${home.title}" (${home.titleLen} chars)`);
  console.log(`  Identifies Web & Mobile App Dev: ${/web/i.test(home.title) && /mobile/i.test(home.title) && /app/i.test(home.title) && /development/i.test(home.title)}`);
  console.log(`  Identifies Palakkad, Kerala: ${/palakkad/i.test(home.title) && /kerala/i.test(home.title)}`);
  console.log(`  Identifies HexaKode: ${/hexakode/i.test(home.title)}`);
  console.log(`- Description: "${home.desc}" (${home.descLen} chars)`);
  console.log(`  Mentions Services: ${/websites/i.test(home.desc) && /mobile apps/i.test(home.desc)}`);
  console.log(`  Mentions Location: ${/palakkad/i.test(home.desc) && /kerala/i.test(home.desc)}`);
  console.log(`- Overall Status: ${home.pass ? "PASS" : "FAIL"}`);
}

run();
