const http = require('http');

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function audit() {
  console.log("=== Auditing /about ===");
  const { status, data } = await fetchHtml('http://localhost:3000/about');
  console.log("Status:", status);

  // 1. Heading Hierarchy
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gis;
  let match;
  const headings = [];
  while ((match = headingRegex.exec(data)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ');
    headings.push({ level, text });
  }

  console.log(`\nFound ${headings.length} headings:`);
  let prevLevel = 0;
  let skips = 0;
  headings.forEach((h, idx) => {
    let warn = "";
    if (idx === 0) {
      if (h.level !== 1) warn = " [FAIL: First heading is not h1]";
    } else {
      if (h.level > prevLevel + 1) {
        warn = ` [FAIL: Skipped level from h${prevLevel} to h${h.level}]`;
        skips++;
      }
    }
    console.log(`  h${h.level}: ${h.text}${warn}`);
    prevLevel = h.level;
  });
  console.log(`Heading skips: ${skips}`);

  // 2. Founders & Team checks
  console.log("\n=== Content Verification ===");
  const checks = [
    { name: "Navaneeth P P in Founders Section", test: data.includes("Navaneeth P P") },
    { name: "Prajosh C in Founders Section", test: data.includes("Prajosh C") },
    { name: "Prajith in Team Section", test: data.includes("Prajith") },
    { name: "Sindhu P completely absent", test: !data.includes("Sindhu") && !data.includes("sindhu") },
    { name: "Meet the Founders Section exists", test: data.includes("Meet the Founders") },
    { name: "Meet the Team Section exists", test: data.includes("Meet the Team") },
    { name: "No LinkedIn or CDN profile photo URLs in HTML", test: !data.includes("profile-displayphoto") && !data.includes("licdn.com") },
    { name: "Founding Year (May 2026)", test: data.includes("2026") && data.includes("May") },
    { name: "Two Friends Origin", test: data.toLowerCase().includes("two friends") },
    { name: "Location (Kerala, India)", test: data.includes("Kerala, India") },
    { name: "Remote-First Working Model", test: data.includes("Remote-First") || data.includes("remote-first") },
    { name: "No Physical Office Statement", test: data.toLowerCase().includes("no physical") || data.toLowerCase().includes("no walk-in office") },
    { name: "Office building image absent", test: !data.includes("modern open-concept office space") },
  ];

  checks.forEach(c => {
    console.log(`  ${c.test ? "✅ PASS" : "❌ FAIL"}: ${c.name}`);
  });

  // 3. JSON-LD checks
  console.log("\n=== JSON-LD Structured Data ===");
  const jsonLdRegex = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  let count = 0;
  while ((scriptMatch = jsonLdRegex.exec(data)) !== null) {
    count++;
    try {
      const parsed = JSON.parse(scriptMatch[1]);
      const types = parsed['@graph'] ? parsed['@graph'].map(g => g['@type']).flat() : [parsed['@type']];
      console.log(`  Script #${count}: Type(s): ${JSON.stringify(types)}`);
      if (parsed['@graph']) {
        parsed['@graph'].forEach(node => {
          if (node['@type'] === 'Person') {
            console.log(`    Person: ${node.name} (${node.jobTitle}) - SameAs: ${node.sameAs || 'None'} - Image: ${node.image || 'None'}`);
          }
          if (node['@type'] === 'AboutPage') {
            console.log(`    AboutPage: @id=${node['@id']} url=${node.url}`);
          }
        });
      }
    } catch (e) {
      console.log(`  Script #${count}: Error parsing JSON:`, e.message);
    }
  }

  // 4. Image verification
  console.log("\n=== Image Verification ===");
  const imgRegex = /<img\s+([^>]*?)>/gi;
  let imgMatch;
  let imgCount = 0;
  let profileImgCount = 0;
  while ((imgMatch = imgRegex.exec(data)) !== null) {
    imgCount++;
    const attrs = imgMatch[1];
    if (attrs.includes("Navaneeth") || attrs.includes("Prajosh") || attrs.includes("Prajith") || attrs.includes("avatar") || attrs.includes("profile")) {
      profileImgCount++;
    }
  }
  console.log(`  Total images on page: ${imgCount}, Profile/Portrait images found: ${profileImgCount}`);
  console.log(`  Profile images check: ${profileImgCount === 0 ? "✅ PASS (0 portraits)" : "❌ FAIL"}`);
}

audit().catch(console.error);
