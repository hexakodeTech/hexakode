const { execSync } = require("child_process");
const fs = require("fs");

const urls = [
  { name: "homepage", url: "http://localhost:3001/" },
  { name: "services", url: "http://localhost:3001/services" },
  { name: "blog", url: "http://localhost:3001/blog/why-we-built-hexakode" },
  { name: "portfolio", url: "http://localhost:3001/portfolio/revopz-website" },
];

const results = {};

for (const target of urls) {
  console.log(`\nTesting ${target.name} (${target.url})...`);
  results[target.name] = [];
  
  for (let i = 1; i <= 2; i++) {
    const outputPath = `reports/temp-lh-${target.name}-${i}.json`;
    console.log(`  Run ${i}...`);
    try {
      execSync(
        `npx lighthouse "${target.url}" --output=json --output-path="${outputPath}" --chrome-flags="--headless --no-sandbox" --only-categories=performance --no-enable-error-reporting`,
        { stdio: "pipe" }
      );
      const data = JSON.parse(fs.readFileSync(outputPath, "utf8"));
      const score = Math.round(data.categories.performance.score * 100);
      const fcp = data.audits["first-contentful-paint"]?.displayValue;
      const lcp = data.audits["largest-contentful-paint"]?.displayValue;
      const tbt = data.audits["total-blocking-time"]?.displayValue;
      const cls = data.audits["cumulative-layout-shift"]?.displayValue;
      const si = data.audits["speed-index"]?.displayValue;
      
      console.log(`  Run ${i}: Score ${score} | FCP ${fcp} | LCP ${lcp} | TBT ${tbt} | CLS ${cls}`);
      results[target.name].push({ score, fcp, lcp, tbt, cls, si });
      fs.unlinkSync(outputPath);
    } catch (err) {
      console.error(`  Run ${i} failed:`, err.message);
    }
  }
}

fs.writeFileSync("reports/multi-run-summary.json", JSON.stringify(results, null, 2));
console.log("\nMulti-run testing complete. Saved to reports/multi-run-summary.json");
