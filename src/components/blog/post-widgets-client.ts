/**
 * Progressive enhancement for inline post widgets. Without JavaScript everything still works:
 * the gallery scrolls and snaps, videos have native controls and an embed is a link to the video
 * page. With it, this adds gallery buttons and keys, the click-to-load player and the copy
 * button on code. Nothing from YouTube or Vimeo loads until the reader asks for the video.
 */
import { initCodeCopy } from "../docs/code-copy-client";
import { EMBED_FRAME_ORIGINS } from "../../lib/blocks/media-urls";

type ClientLabels = { copy: string; copied: string; failed: string; slideOf: string };

const motionOk = () => window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
const fill = (template: string, n: number, total: number) => template.replace("{n}", String(n)).replace("{total}", String(total));

function initGallery(root: HTMLElement, labels: ClientLabels) {
  const track = root.querySelector<HTMLElement>("[data-pw-track]");
  const controls = root.querySelector<HTMLElement>("[data-pw-controls]");
  const prev = root.querySelector<HTMLButtonElement>("[data-pw-prev]");
  const next = root.querySelector<HTMLButtonElement>("[data-pw-next]");
  const count = root.querySelector<HTMLElement>("[data-pw-count]");
  if (!track || !controls || !prev || !next || !count) return;
  const total = track.children.length;
  const current = () => Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
  const go = (index: number) => {
    const target = Math.min(Math.max(index, 0), total - 1);
    track.scrollTo({ left: target * track.clientWidth, behavior: motionOk() ? "smooth" : "auto" });
  };
  let frame = 0;
  const sync = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const i = current();
      count.textContent = fill(labels.slideOf, i + 1, total);
      prev.disabled = i <= 0;
      next.disabled = i >= total - 1;
    });
  };
  prev.addEventListener("click", () => go(current() - 1));
  next.addEventListener("click", () => go(current() + 1));
  track.addEventListener("scroll", sync, { passive: true });
  track.addEventListener("keydown", (event) => {
    const keys: Record<string, number> = { ArrowLeft: current() - 1, ArrowRight: current() + 1, Home: 0, End: total - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    go(keys[event.key]);
  });
  if (controls.hidden !== false) controls.hidden = false;
  sync();
}

function initEmbed(figure: HTMLElement) {
  const trigger = figure.querySelector<HTMLAnchorElement>("[data-pw-embed-trigger]");
  const src = figure.dataset.src ?? "";
  let origin = "";
  try {
    origin = new URL(src).origin;
  } catch {
    return;
  }
  // The server builds this URL from a parsed id; checking the origin again keeps a tampered page from framing anything else.
  if (!trigger || !(EMBED_FRAME_ORIGINS as readonly string[]).includes(origin)) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = trigger.className;
  button.setAttribute("aria-label", figure.dataset.play ?? "");
  while (trigger.firstChild) button.appendChild(trigger.firstChild);
  trigger.parentNode?.replaceChild(button, trigger);
  button.addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.src = src;
    frame.title = figure.dataset.title ?? "";
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    button.parentNode?.replaceChild(frame, button);
    frame.focus();
  });
}

function initAutoplay(video: HTMLVideoElement) {
  // Muted loops start on their own only for readers who allow motion, and only while on screen.
  if (!motionOk() || !("IntersectionObserver" in window)) return;
  video.muted = true;
  new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) video.play().catch(() => undefined);
      else video.pause();
    }
  }, { threshold: 0.5 }).observe(video);
}

const root = document.querySelector<HTMLElement>("[data-post-widgets]");
if (root) {
  let labels: ClientLabels | null = null;
  try {
    labels = JSON.parse(root.dataset.postWidgets ?? "") as ClientLabels;
  } catch {
    /* labels are rendered by the server; without them the widgets keep their no-JS behaviour */
  }
  if (labels) {
    root.querySelectorAll<HTMLElement>("[data-pw-gallery]").forEach((el) => initGallery(el, labels));
    initCodeCopy(labels);
  }
  root.querySelectorAll<HTMLElement>("[data-pw-embed]").forEach(initEmbed);
  root.querySelectorAll<HTMLVideoElement>("video[data-pw-autoplay]").forEach(initAutoplay);
}
