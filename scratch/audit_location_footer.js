const http = require("http");

const SUPPLIED_GBP_URL = "https://www.google.com/search?kgmid=%2Fg%2F11npyfhq8b&hl=ml-IN&q=HexaKode&shem=epsd1%2Cesd2e%2Cltae%2Crimspwouoe%2Csdpie&shndl=30&source=sh%2Fx%2Floc%2Fosrp%2Fm5%2F1&kgs=73fee9171bc13cab";

const testRoutes = [
  "/contact",
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/blog"
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

function decodeHtml(html) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

async function runAudit() {
  console.log("================================================================================");
  console.log("HEXAKODE LOCATION & FOOTER AUDIT (PORT 3009)");
  console.log("Business Location: Kerala, India (Remote-first, No Physical Office)");
  console.log("================================================================================\n");

  let allChecksPassed = true;

  // 1. Audit Contact Page (/contact)
  console.log("--- 1. AUDITING CONTACT PAGE (/contact) ---");
  const contactRes = await fetchRoute("/contact");
  const contactHtml = decodeHtml(contactRes.html);

  const hasPhoneContact = contactHtml.includes("+91 95398 28694") && contactHtml.includes("href=\"tel:+919539828694\"");
  const hasEmailContact = contactHtml.includes("contact@hexakode.in") && contactHtml.includes("href=\"mailto:contact@hexakode.in\"");
  const hasLocationContact = contactHtml.includes("Kerala, India");
  const hasWebsiteContact = contactHtml.includes("https://hexakode.in");
  const hasGbpLinkContact = contactHtml.includes(SUPPLIED_GBP_URL) && contactHtml.includes("target=\"_blank\"") && contactHtml.includes("rel=\"noopener noreferrer\"");

  // Negative checks: NO street address, physical office claim, or map embed
  const hasStreetAddress = /street\s*address/i.test(contactHtml) || /office\s*address/i.test(contactHtml);
  const hasMapEmbed = /<iframe[^>]*google\.com\/maps/i.test(contactHtml) || /map-placeholder/i.test(contactHtml);
  const hasFakeOfficeImage = /HexaKode Kerala Office location/i.test(contactHtml);

  console.log(`- HTTP Status: ${contactRes.status} [${contactRes.status === 200 ? "PASS" : "FAIL"}]`);
  console.log(`- Phone (+91 95398 28694 with tel: link): ${hasPhoneContact ? "PASS" : "FAIL"}`);
  console.log(`- Email (contact@hexakode.in with mailto: link): ${hasEmailContact ? "PASS" : "FAIL"}`);
  console.log(`- Location (Kerala, India as service area): ${hasLocationContact ? "PASS" : "FAIL"}`);
  console.log(`- Website (https://hexakode.in): ${hasWebsiteContact ? "PASS" : "FAIL"}`);
  console.log(`- Google Business Profile Link: ${hasGbpLinkContact ? "PASS" : "FAIL"}`);
  console.log(`- No Street/Office Address Claim: ${!hasStreetAddress ? "PASS" : "FAIL"}`);
  console.log(`- No Google Maps Embed: ${!hasMapEmbed ? "PASS" : "FAIL"}`);
  console.log(`- No Fake Office-Location Image: ${!hasFakeOfficeImage ? "PASS" : "FAIL"}`);

  if (!hasPhoneContact || !hasEmailContact || !hasLocationContact || !hasWebsiteContact || !hasGbpLinkContact || hasStreetAddress || hasMapEmbed || hasFakeOfficeImage) {
    allChecksPassed = false;
  }

  // 2. Audit Structured Data on Contact Page
  console.log("\n--- 2. AUDITING STRUCTURED DATA (JSON-LD) ---");
  const jsonLdMatches = [...contactRes.html.matchAll(/<script[^>]*type=["\x27]application\/ld\+json["\x27][^>]*>([\s\S]*?)<\/script>/gi)];
  let foundOrgSchema = false;
  let foundGbpInSameAs = false;
  let foundTruthfulAddress = false;

  for (const m of jsonLdMatches) {
    try {
      const data = JSON.parse(m[1]);
      const graph = data["@graph"] || [data];
      for (const item of graph) {
        if (item["@type"] === "Organization" || (Array.isArray(item["@type"]) && item["@type"].includes("Organization"))) {
          foundOrgSchema = true;
          if (item.address && item.address.addressRegion === "Kerala" && item.address.addressCountry === "IN" && !item.address.streetAddress) {
            foundTruthfulAddress = true;
          }
          if (item.sameAs && item.sameAs.includes(SUPPLIED_GBP_URL)) {
            foundGbpInSameAs = true;
          }
        }
      }
    } catch (e) {}
  }

  console.log(`- Organization / ProfessionalService Schema: ${foundOrgSchema ? "PASS" : "FAIL"}`);
  console.log(`- Truthful PostalAddress (Kerala, IN, no streetAddress): ${foundTruthfulAddress ? "PASS" : "FAIL"}`);
  console.log(`- Google Business Profile URL in sameAs: ${foundGbpInSameAs ? "PASS" : "FAIL"}`);

  if (!foundOrgSchema || !foundTruthfulAddress || !foundGbpInSameAs) {
    allChecksPassed = false;
  }

  // 3. Audit Footer Across Representative Routes
  console.log("\n--- 3. AUDITING FOOTER ACROSS ROUTES ---");
  for (const route of testRoutes) {
    const res = await fetchRoute(route);
    const html = decodeHtml(res.html);

    const footerHasLocation = html.includes("Kerala, India");
    const footerHasPhone = html.includes("+91 95398 28694") && html.includes("href=\"tel:+919539828694\"");
    const footerHasEmail = html.includes("contact@hexakode.in") && html.includes("href=\"mailto:contact@hexakode.in\"");
    const footerHasWebsite = html.includes("https://hexakode.in");
    const footerHasGbp = html.includes(SUPPLIED_GBP_URL) && html.includes("target=\"_blank\"") && html.includes("rel=\"noopener noreferrer\"");

    const footerPass = footerHasLocation && footerHasPhone && footerHasEmail && footerHasWebsite && footerHasGbp;
    if (!footerPass) allChecksPassed = false;

    console.log(`Route ${route.padEnd(12)}: Location=${footerHasLocation}, Phone=${footerHasPhone}, Email=${footerHasEmail}, Website=${footerHasWebsite}, GBP=${footerHasGbp} -> [${footerPass ? "PASS" : "FAIL"}]`);
  }

  console.log("\n================================================================================");
  console.log(`FINAL RESULT: ${allChecksPassed ? "ALL AUDIT CHECKS PASSED (100% COMPLIANT)" : "FAILURES DETECTED"}`);
  console.log("================================================================================");
}

runAudit();
