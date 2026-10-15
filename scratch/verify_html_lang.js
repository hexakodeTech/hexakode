const http = require("http");

const routes = [
  "/",
  "/about",
  "/contact",
  "/services",
  "/services/web-development",
  "/portfolio",
  "/blog",
  "/blog/why-we-built-hexakode",
  "/blog/authors/navaneeth-pp"
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    http.get("http://localhost:3000" + route, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        const match = data.match(/<html([^>]*)>/i);
        const langMatch = match ? match[1].match(/lang=["']([^"']+)["']/i) : null;
        const langValue = langMatch ? langMatch[1] : null;

        console.log(`Route: ${route}`);
        console.log(`Status: ${res.statusCode}`);
        console.log(`Lang: ${langValue || "MISSING"}`);
        console.log(`Full Tag: ${match ? match[0] : "NOT FOUND"}`);
        console.log("--------------------------------------------------");
        resolve({
          route,
          status: res.statusCode,
          lang: langValue,
          tag: match ? match[0] : null
        });
      });
    }).on("error", (err) => {
      console.error(`Error on ${route}:`, err.message);
      resolve({ route, error: err.message });
    });
  });
}

(async () => {
  console.log("Verifying HTML lang attribute on server-rendered pages...\n");
  const results = [];
  for (const r of routes) {
    const res = await checkRoute(r);
    results.push(res);
  }

  const allPass = results.every(r => r.lang === "en" && r.status === 200);
  console.log(`\nAll tested routes pass: ${allPass ? "YES (lang=\"en\")" : "NO"}`);
})();
