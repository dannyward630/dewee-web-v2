/**
 * Shared bits for the post widget renderers (isomorphic): labels, escaping helpers and icons.
 * Renderers build HTML strings from props that the block registry has just validated; every
 * text and attribute still goes through `escapeHtml` (or `inlineMarkup`, which escapes first).
 */
import { ICONS, type IconName } from "../../../components/ui/icon-paths";
import { escapeHtml } from "../../inline-markup";

/** UI strings for one locale (copy lives in src/content/pages/blog.ts as `BLOG.widgets`). */
export type WidgetLabels = {
  copy: string;
  copied: string;
  copyFailed: string;
  plainCode: string;
  gallery: string;
  previous: string;
  next: string;
  slideOf: string;
  play: string;
  watchOn: string;
  videoFile: string;
  viewOn: string;
  postBy: string;
  previewOnly: string;
  noticeMissing: string;
  noticeInvalid: string;
  noticeMalformed: string;
  noticeNested: string;
  noticeDuplicate: string;
  noticeUnplacedInvalid: string;
};

export type RenderMode = "public" | "preview";
export type WidgetContext = { labels: WidgetLabels };

export const esc = escapeHtml;

/** Fills `{name}` placeholders; values are escaped by the caller's output path, not here. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

/** `name="value"` pairs for defined values only; booleans become bare attributes. */
export function attrs(pairs: Record<string, string | number | boolean | undefined | null>): string {
  return Object.entries(pairs)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(String(v))}"`))
    .join("");
}

export function icon(name: IconName, size = 18): string {
  return `<svg class="icon" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
}

/** The optional heading reused page blocks carry; an h2 in a post, so heading levels never skip. */
export function blockHeading(heading: unknown, inline: (s: string) => string): string {
  if (!heading || typeof heading !== "object") return "";
  const h = heading as { eyebrow?: string; title?: string; lede?: string };
  if (!h.title) return "";
  return (
    `<header class="pw-head">` +
    (h.eyebrow ? `<p class="pw-head__eyebrow">${esc(h.eyebrow)}</p>` : "") +
    `<h2 class="pw-head__title">${inline(h.title)}</h2>` +
    (h.lede ? `<p class="pw-head__lede">${inline(h.lede)}</p>` : "") +
    `</header>`
  );
}
