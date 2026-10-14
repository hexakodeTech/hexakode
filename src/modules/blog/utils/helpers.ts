/**
 * Estimate reading time from HTML content.
 * Strips HTML tags and counts words at ~200 wpm.
 */
export function calculateReadingTime(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Generate a URL-safe slug from a title string.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

/**
 * Format a date for display.
 */
export function formatBlogDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export interface TocHeading {
  id: string;
  level: number;
  text: string;
}

/**
 * Generate a URL-safe slug from heading text.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/&amp;/g, "and")
    .replace(/&[^;]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Extract H2/H3/H4 headings from HTML for Table of Contents.
 * Parses headings, generating clean unique ids from heading text with duplicate suffixing (-2, -3, etc.).
 */
export function extractTableOfContents(htmlContent: string): TocHeading[] {
  if (!htmlContent) return [];
  const headings: TocHeading[] = [];
  const regex = /<h([234])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;
  const usedCounts = new Map<string, number>();

  while ((match = regex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1], 10);
    const rawText = match[2];
    const text = rawText
      .replace(/<[^>]*>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .trim();

    if (!text) continue;

    const baseSlug = slugifyHeading(text) || "heading";
    const count = (usedCounts.get(baseSlug) || 0) + 1;
    usedCounts.set(baseSlug, count);

    const id = count === 1 ? baseSlug : `${baseSlug}-${count}`;

    headings.push({ id, level, text });
  }
  return headings;
}

/**
 * Injects deterministic id attributes and scroll-margin classes into H2, H3, and H4 tags.
 * Ensures initial server-rendered HTML matches extractTableOfContents for deep linking, TOC navigation, and SEO.
 */
export function injectHeadingIds(htmlContent: string): string {
  if (!htmlContent) return "";
  const usedCounts = new Map<string, number>();

  return htmlContent.replace(
    /<h([234])(\b[^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level, attrs, innerContent) => {
      const text = innerContent
        .replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .trim();

      if (!text) return match;

      const baseSlug = slugifyHeading(text) || "heading";
      const count = (usedCounts.get(baseSlug) || 0) + 1;
      usedCounts.set(baseSlug, count);

      const id = count === 1 ? baseSlug : `${baseSlug}-${count}`;

      let newAttrs = attrs;
      if (/id=["'][^"']*["']/i.test(newAttrs)) {
        newAttrs = newAttrs.replace(/id=["'][^"']*["']/i, `id="${id}"`);
      } else {
        newAttrs = `${newAttrs} id="${id}"`;
      }

      if (/class=["'][^"']*["']/i.test(newAttrs)) {
        newAttrs = newAttrs.replace(
          /class=["']([^"']*)["']/i,
          (clsMatch: string, classNames: string) => {
            if (classNames.includes("scroll-mt-28")) return clsMatch;
            return `class="${classNames} scroll-mt-28"`;
          }
        );
      } else {
        newAttrs = `${newAttrs} class="scroll-mt-28"`;
      }

      return `<h${level}${newAttrs}>${innerContent}</h${level}>`;
    }
  );
}

/**
 * Extract FAQ entries from HTML for JSON-LD FAQPage schema.
 * Looks for question headings followed by paragraph answers.
 */
export interface FaqEntry {
  question: string;
  answer: string;
}

export function extractFaqEntries(htmlContent: string): FaqEntry[] {
  const faqs: FaqEntry[] = [];
  const questionPattern = /^(what|how|why|when|where|who|is|are|can|do|does|should|will|which)/i;

  const parts = htmlContent.split(/(?=<h[23])/i);
  for (const part of parts) {
    const headingMatch = part.match(/<h[23][^>]*>(.*?)<\/h[23]>/i);
    if (!headingMatch) continue;
    const question = headingMatch[1].replace(/<[^>]*>/g, "").trim();
    if (!question.endsWith("?") && !questionPattern.test(question)) continue;

    const afterHeading = part.slice(headingMatch.index! + headingMatch[0].length);
    const parasMatch = afterHeading.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (!parasMatch) continue;
    const answer = parasMatch[1].replace(/<[^>]*>/g, "").trim();
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs;
}
