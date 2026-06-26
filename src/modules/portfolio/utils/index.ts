// ─────────────────────────────────────────────────────────────────────────────
// Portfolio CMS Module — Utility Functions
// Pure functions with no side effects — safe to replace / extend for backend.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts a human-readable string to a URL-safe slug.
 * e.g. "My Cool Project!" → "my-cool-project"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncates a string to a given max length, appending "…" if truncated.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Formats an ISO date string to a human-readable short date.
 * e.g. "2026-04-01T08:00:00Z" → "Apr 1, 2026"
 */
export function formatDate(isoString: string | null): string {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Generates a unique ID string for new records.
 */
export function generateId(prefix = "pf"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Returns the current ISO timestamp string.
 */
export function nowISO(): string {
  return new Date().toISOString();
}

/**
 * Returns the initials (up to 2 chars) from a full name string.
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Splits a comma-separated technology string into an array of trimmed tags.
 */
export function parseTechTags(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Returns the count of visible tech chips and the overflow count.
 */
export function getTechChipDisplay(
  technologies: string[],
  max = 4
): { visible: string[]; overflow: number } {
  return {
    visible: technologies.slice(0, max),
    overflow: Math.max(0, technologies.length - max),
  };
}
