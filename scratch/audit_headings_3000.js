const http = require('http');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

const ROUTES = [
  '/',
  '/services',
  '/services/web-development',
  '/services/mobile-app-development',
  '/services/ui-ux-design',
  '/services/digital-marketing',
  '/portfolio',
  '/portfolio/revopz-internal-management-system',
  '/portfolio/revopz-website',
  '/blog',
  '/blog/why-we-built-hexakode',
  '/blog/web-engineering-a-complete-guide-to-building-modern-scalable-web-applications',
  '/blog/how-much-does-a-business-website-cost-in-kerala',
  '/blog/hexakode-5-client-promises',
  '/blog/what-is-ui-ux-designer',
  '/about',
  '/contact',
  '/careers',
  '/privacy-policy',
  '/terms-of-service',
  '/cookie-policy',
];

function fetchHtml(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, html: data }));
    }).on('error', reject);
  });
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractHeadings(html) {
  // We can track if inside <footer>
  const footerRegex = /<footer\b[^>]*>([\s\S]*?)<\/footer>/gi;
  let footerHtmls = [];
  let fMatch;
  while ((fMatch = footerRegex.exec(html)) !== null) {
    footerHtmls.push(fMatch[1]);
  }

  // Regex to match h1-h6 tags with their content
  const headingRegex = /<(h[1-6])\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const level = parseInt(tag.replace('h', ''), 10);
    const attrs = match[2];
    const rawContent = match[3];
    const textContent = decodeEntities(rawContent.replace(/<[^>]+>/g, ''));
    
    // Check if this occurrence is inside footer
    const isInsideFooter = footerHtmls.some(f => f.includes(match[0]));

    headings.push({
      tag,
      level,
      text: textContent,
      empty: textContent.length === 0,
      inFooter: isInsideFooter,
      raw: match[0],
      index: match.index
    });
  }

  return headings;
}

function analyzeHierarchy(headings) {
  const issues = [];
  let skips = 0;
  let emptyCount = 0;
  let footerHeadingCount = 0;

  // Track h1 count
  const h1s = headings.filter(h => h.level === 1);
  if (h1s.length === 0) {
    issues.push('Missing <h1> primary heading');
  } else if (h1s.length > 1) {
    issues.push(`Multiple <h1> headings found (${h1s.length}): ${h1s.map(h => `"${h.text}"`).join(', ')}`);
  }

  let prevLevel = 0;

  for (let i = 0; i < headings.length; i++) {
    const h = headings[i];

    if (h.empty) {
      emptyCount++;
      issues.push(`Empty heading <${h.tag}> at position ${i + 1}`);
    }

    if (h.inFooter) {
      footerHeadingCount++;
      issues.push(`Footer heading <${h.tag}> "${h.text}" pollutes document outline`);
    }

    // Check heading level skip
    if (prevLevel === 0) {
      // First heading
      if (h.level !== 1) {
        skips++;
        issues.push(`First heading is <${h.tag}> "${h.text}" (expected <h1>)`);
      }
    } else {
      if (h.level > prevLevel + 1) {
        skips++;
        issues.push(`Heading skip from <h${prevLevel}> to <${h.tag}>: "${h.text}"`);
      }
    }

    // Only update prevLevel if not in footer (or if we want to check footer skips too)
    prevLevel = h.level;
  }

  return {
    h1Count: h1s.length,
    skips,
    emptyCount,
    footerHeadingCount,
    issues,
    sequence: headings.map(h => `<${h.tag}>`).join(' → ')
  };
}

async function run() {
  console.log('='.repeat(100));
  console.log('AUDITING SITEWIDE HEADING HIERARCHY & ACCESSIBILITY');
  console.log('='.repeat(100));

  for (const route of ROUTES) {
    const { status, html } = await fetchHtml(route);
    const headings = extractHeadings(html);
    const analysis = analyzeHierarchy(headings);

    console.log(`\nROUTE: ${route} (HTTP ${status})`);
    console.log(`Headings found: ${headings.length} | H1 Count: ${analysis.h1Count} | Skips: ${analysis.skips} | Footer Headings: ${analysis.footerHeadingCount}`);
    console.log(`Sequence: ${analysis.sequence || 'None'}`);
    
    if (analysis.issues.length > 0) {
      console.log('Issues:');
      analysis.issues.forEach(iss => console.log(`  - ${iss}`));
    } else {
      console.log('  ✓ No issues found');
    }

    // Detailed heading outline
    console.log('Outline:');
    headings.forEach((h, idx) => {
      const indent = '  '.repeat(h.level);
      const tagStr = `<${h.tag}>`.padEnd(6);
      const footerBadge = h.inFooter ? ' [FOOTER]' : '';
      console.log(`${indent}${tagStr} ${h.text}${footerBadge}`);
    });
  }
}

run();
