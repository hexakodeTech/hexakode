const http = require('http');

function fetchHtml(urlPath) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://127.0.0.1:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, html: data }));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy(new Error('Request timed out after 30s'));
    });
  });
}

function parseJsonLd(html) {
  const jsonLdRegex = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  const results = [];
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      results.push(JSON.parse(match[1]));
    } catch (e) {
      results.push({ error: e.message, raw: match[1] });
    }
  }
  return results;
}

function extractHeadings(html) {
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gis;
  let match;
  const headings = [];
  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1], 10),
      text: match[2].replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ')
    });
  }
  return headings;
}

const PUBLISHED_POSTS = [
  {
    slug: 'web-engineering-a-complete-guide-to-building-modern-scalable-web-applications',
    expectedAuthor: 'Prajosh C',
    expectedAuthorSlug: 'prajosh-c'
  },
  {
    slug: 'how-much-does-a-business-website-cost-in-kerala',
    expectedAuthor: 'Navaneeth P P',
    expectedAuthorSlug: 'navaneeth-pp'
  },
  {
    slug: 'hexakode-5-client-promises',
    expectedAuthor: 'Prajosh C',
    expectedAuthorSlug: 'prajosh-c'
  },
  {
    slug: 'why-we-built-hexakode',
    expectedAuthor: 'Navaneeth P P',
    expectedAuthorSlug: 'navaneeth-pp'
  },
  {
    slug: 'what-is-ui-ux-designer',
    expectedAuthor: 'Prajith',
    expectedAuthorSlug: 'prajith'
  }
];

const AUTHORS = [
  { slug: 'navaneeth-pp', name: 'Navaneeth P P', role: 'Co-Founder & CEO, Full Stack Engineer' },
  { slug: 'prajosh-c', name: 'Prajosh C', role: 'Co-Founder & CTO, Backend Engineer' },
  { slug: 'prajith', name: 'Prajith', role: 'UI/UX Designer & Team Member' },
];

async function runAudit() {
  console.log('='.repeat(80));
  console.log('AUDIT: BLOG ARTICLES & AUTHOR BIOGRAPHY ARCHITECTURE');
  console.log('='.repeat(80));

  let totalErrors = 0;

  // 1. Audit Each Published Blog Article
  console.log('\n--- 1. AUDITING PUBLISHED BLOG ARTICLES ---');
  for (const post of PUBLISHED_POSTS) {
    const route = `/blog/${post.slug}`;
    console.log(`\nTesting article: ${route}`);
    const { status, html } = await fetchHtml(route);
    
    if (status !== 200) {
      console.log(`  ❌ FAIL: HTTP Status ${status}`);
      totalErrors++;
      continue;
    }
    console.log(`  ✅ HTTP 200 OK`);

    // Check visible author name
    const hasAuthorName = html.includes(post.expectedAuthor);
    console.log(`  ${hasAuthorName ? '✅ PASS' : '❌ FAIL'}: Author name "${post.expectedAuthor}" visible in HTML`);
    if (!hasAuthorName) totalErrors++;

    // Check author bio link
    const expectedAuthorUrl = `/blog/authors/${post.expectedAuthorSlug}`;
    const hasAuthorLink = html.includes(`href="${expectedAuthorUrl}"`) || html.includes(`href='${expectedAuthorUrl}'`);
    console.log(`  ${hasAuthorLink ? '✅ PASS' : '❌ FAIL'}: Clickable link to author bio "${expectedAuthorUrl}" present`);
    if (!hasAuthorLink) totalErrors++;

    // Check generic author absence
    const hasGenericAuthor = html.includes('Written by</span><p class="text-sm font-bold text-navy-dark leading-tight mt-0.5">HexaKode Team</p>');
    console.log(`  ${!hasGenericAuthor ? '✅ PASS' : '❌ FAIL'}: Generic "HexaKode Team" author avoided`);
    if (hasGenericAuthor) totalErrors++;

    // Check JSON-LD
    const jsonLds = parseJsonLd(html);
    const blogPosting = jsonLds.find(j => j['@type'] === 'BlogPosting');
    if (!blogPosting) {
      console.log(`  ❌ FAIL: No BlogPosting JSON-LD found`);
      totalErrors++;
    } else {
      const authorObj = blogPosting.author;
      const expectedPersonId = `https://hexakode.in/blog/authors/${post.expectedAuthorSlug}#person`;
      const expectedUrl = `https://hexakode.in/blog/authors/${post.expectedAuthorSlug}`;
      
      const isPerson = authorObj && authorObj['@type'] === 'Person';
      const matchesId = authorObj && authorObj['@id'] === expectedPersonId;
      const matchesName = authorObj && authorObj.name === post.expectedAuthor;
      const matchesUrl = authorObj && authorObj.url === expectedUrl;

      console.log(`  ${isPerson ? '✅ PASS' : '❌ FAIL'}: BlogPosting.author is Person`);
      console.log(`  ${matchesId ? '✅ PASS' : '❌ FAIL'}: BlogPosting.author.@id = ${authorObj ? authorObj['@id'] : 'null'}`);
      console.log(`  ${matchesName ? '✅ PASS' : '❌ FAIL'}: BlogPosting.author.name = "${authorObj ? authorObj.name : 'null'}"`);
      console.log(`  ${matchesUrl ? '✅ PASS' : '❌ FAIL'}: BlogPosting.author.url = ${authorObj ? authorObj.url : 'null'}`);

      if (!isPerson || !matchesId || !matchesName || !matchesUrl) totalErrors++;
    }
  }

  // 2. Audit Each Author Biography Page
  console.log('\n--- 2. AUDITING AUTHOR BIOGRAPHY PAGES ---');
  for (const author of AUTHORS) {
    const route = `/blog/authors/${author.slug}`;
    console.log(`\nTesting author page: ${route}`);
    const { status, html } = await fetchHtml(route);

    if (status !== 200) {
      console.log(`  ❌ FAIL: HTTP Status ${status}`);
      totalErrors++;
      continue;
    }
    console.log(`  ✅ HTTP 200 OK`);

    // Heading hierarchy
    const headings = extractHeadings(html);
    let skips = 0;
    let prev = 0;
    headings.forEach((h, idx) => {
      if (idx === 0 && h.level !== 1) skips++;
      if (idx > 0 && h.level > prev + 1) skips++;
      prev = h.level;
    });
    console.log(`  ${skips === 0 ? '✅ PASS' : '❌ FAIL'}: Heading hierarchy has ${skips} skips (${headings.length} headings, h1: "${headings[0]?.text}")`);
    if (skips > 0) totalErrors++;

    // Content checks
    const hasName = html.includes(author.name);
    const hasRole = html.includes(author.role);
    console.log(`  ${hasName ? '✅ PASS' : '❌ FAIL'}: Author name "${author.name}" rendered`);
    console.log(`  ${hasRole ? '✅ PASS' : '❌ FAIL'}: Author role "${author.role}" rendered`);
    if (!hasName || !hasRole) totalErrors++;

    // JSON-LD checks
    const jsonLds = parseJsonLd(html);
    const allNodes = jsonLds.flatMap(j => j['@graph'] || (j['@type'] ? [j] : []));
    const profilePage = allNodes.find(n => n['@type'] === 'ProfilePage');
    const person = allNodes.find(n => n['@type'] === 'Person');
      const expectedPersonId = `https://hexakode.in/blog/authors/${author.slug}#person`;
      const expectedUrl = `https://hexakode.in/blog/authors/${author.slug}`;

      const validProfile = profilePage && profilePage.url === expectedUrl && profilePage.mainEntity?.['@id'] === expectedPersonId;
      const validPerson = person && person['@id'] === expectedPersonId && person.name === author.name && person.worksFor?.['@id'] === 'https://hexakode.in/#organization';

      console.log(`  ${validProfile ? '✅ PASS' : '❌ FAIL'}: ProfilePage structured data valid (@id=${profilePage?.['@id']})`);
      console.log(`  ${validPerson ? '✅ PASS' : '❌ FAIL'}: Person structured data valid (@id=${person?.['@id']}, name=${person?.name})`);

      if (!validProfile || !validPerson) totalErrors++;
  }

  console.log('\n' + '='.repeat(80));
  console.log(`AUDIT SUMMARY: ${totalErrors === 0 ? 'ALL CHECKS PASSED (0 ERRORS)' : `FOUND ${totalErrors} ERRORS`}`);
  console.log('='.repeat(80));
}

runAudit().catch(console.error);
