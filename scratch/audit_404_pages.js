const http = require("http");

const testCases = [
  // 404 test cases
  { url: "/this-page-should-not-exist-404-test", expectedStatus: 404, shouldHaveBrand404: true },
  { url: "/blog/nonexistent-post-404-test", expectedStatus: 404, shouldHaveBrand404: true },
  { url: "/blog/authors/nonexistent-author-404-test", expectedStatus: 404, shouldHaveBrand404: true },
  { url: "/portfolio/nonexistent-project-404-test", expectedStatus: 404, shouldHaveBrand404: true },
  { url: "/services/nonexistent-service-404-test", expectedStatus: 404, shouldHaveBrand404: true },
  { url: "/careers/nonexistent-position", expectedStatus: 404, shouldHaveBrand404: true },
  { url: "/admin/nonexistent-admin-page", expectedStatus: 404, shouldHaveBrand404: true },
  // 200 valid test cases
  { url: "/", expectedStatus: 200, shouldHaveBrand404: false },
  { url: "/about", expectedStatus: 200, shouldHaveBrand404: false },
  { url: "/contact", expectedStatus: 200, shouldHaveBrand404: false },
  { url: "/services", expectedStatus: 200, shouldHaveBrand404: false },
  { url: "/services/web-development", expectedStatus: 200, shouldHaveBrand404: false },
  { url: "/portfolio", expectedStatus: 200, shouldHaveBrand404: false },
  { url: "/portfolio/revopz-website", expectedStatus: 200, shouldHaveBrand404: false },
  { url: "/blog", expectedStatus: 200, shouldHaveBrand404: false },
  { url: "/blog/why-we-built-hexakode", expectedStatus: 200, shouldHaveBrand404: false },
  { url: "/blog/authors/navaneeth-pp", expectedStatus: 200, shouldHaveBrand404: false },
];

function checkUrl(testCase) {
  return new Promise((resolve) => {
    http.get("http://localhost:3000" + testCase.url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        const statusMatch = res.statusCode === testCase.expectedStatus;
        const has404Heading = data.includes("Page Not Found") || data.includes("ERROR 404");
        const unescaped = data.replace(/\\\\/g, "\\").replace(/\\"/g, "\"");
        const hasHomeLink = unescaped.includes('href="/"') || unescaped.includes('"href":"/"');
        const hasBackToHomeText = data.includes("Back to Home");

        let brandPass = true;
        if (testCase.shouldHaveBrand404) {
          brandPass = has404Heading && hasHomeLink && hasBackToHomeText;
        }

        const pass = statusMatch && brandPass;

        console.log(`URL: ${testCase.url}`);
        console.log(`  Status: ${res.statusCode} (Expected: ${testCase.expectedStatus}) -> ${statusMatch ? "OK" : "FAIL"}`);
        if (testCase.shouldHaveBrand404) {
          console.log(`  Branded 404 Content: heading=${has404Heading}, homeLink=${hasHomeLink}, backToHomeText=${hasBackToHomeText} -> ${brandPass ? "OK" : "FAIL"}`);
        }
        console.log(`  Overall: ${pass ? "PASS" : "FAIL"}`);
        console.log("------------------------------------------------------------------");
        resolve({ url: testCase.url, pass, status: res.statusCode });
      });
    }).on("error", (err) => {
      console.error(`Error on ${testCase.url}:`, err.message);
      resolve({ url: testCase.url, pass: false, error: err.message });
    });
  });
}

(async () => {
  console.log("Starting 404 Status & Page Audit...\n");
  const results = [];
  for (const tc of testCases) {
    const res = await checkUrl(tc);
    results.push(res);
  }

  const allPassed = results.every(r => r.pass);
  console.log(`\nAudit Complete: ${results.filter(r => r.pass).length}/${results.length} passed.`);
  if (!allPassed) {
    process.exit(1);
  }
})();
