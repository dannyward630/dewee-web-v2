import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  H1_FLAG_KEY,
  H1_PENDING_CLASS,
  H1_RESOLVE_TIMEOUT_MS,
  H1_VARIANT_DATASET_KEY,
  chooseH1Variant,
  parseH1Variant,
  runHeroH1Experiment,
  type H1ExperimentDeps,
} from "../src/lib/hero-h1-experiment";
import { HOME, HOME_H1_CATEGORY } from "../src/content/pages/home";

const CATEGORY_HTML = '<span class="hero__line">category</span>';
const CONTROL_HTML = "control";

/** A PostHog stand-in: `answer` is what the flag returns; `fire()` plays the "flags loaded" callback. */
function setup(over: Partial<H1ExperimentDeps> & { answer?: unknown; noPosthog?: boolean } = {}) {
  const root = { dataset: {} as Record<string, string | undefined>, classList: { removed: [] as string[], remove(n: string) { this.removed.push(n); } } };
  const h1 = { innerHTML: CONTROL_HTML };
  const calls: string[] = [];
  let loaded: (() => void) | undefined;
  let timer: (() => void) | undefined;
  const posthog = over.noPosthog ? undefined : {
    onFeatureFlags: (cb: () => void) => { loaded = cb; },
    getFeatureFlag: (key: string) => { calls.push(key); return over.answer; },
  };
  runHeroH1Experiment({
    root, h1, categoryHtml: CATEGORY_HTML, consented: true, posthog,
    setTimer: (cb, ms) => { expect(ms).toBe(H1_RESOLVE_TIMEOUT_MS); timer = cb; },
    ...over,
  });
  return { root, h1, calls, fire: () => loaded?.(), timeout: () => timer?.() };
}

describe("variant selection", () => {
  it("accepts only the known variants", () => {
    expect(parseH1Variant("control")).toBe("control");
    expect(parseH1Variant("category")).toBe("category");
    for (const v of [undefined, null, false, true, "", "Category", "other"]) expect(parseH1Variant(v)).toBeNull();
  });

  it("never enrolls without consent", () => {
    expect(chooseH1Variant(false, "category")).toBeNull();
    expect(chooseH1Variant(true, "category")).toBe("category");
  });
});

describe("runHeroH1Experiment", () => {
  it("swaps the headline and tags the visitor when the flag says category", () => {
    const t = setup({ answer: "category" });
    t.fire();
    expect(t.calls).toEqual([H1_FLAG_KEY]);
    expect(t.h1.innerHTML).toBe(CATEGORY_HTML);
    expect(t.root.dataset[H1_VARIANT_DATASET_KEY]).toBe("category");
    expect(t.root.classList.removed).toContain(H1_PENDING_CLASS);
  });

  it("tags control visitors without touching the headline", () => {
    const t = setup({ answer: "control" });
    t.fire();
    expect(t.h1.innerHTML).toBe(CONTROL_HTML);
    expect(t.root.dataset[H1_VARIANT_DATASET_KEY]).toBe("control");
  });

  it.each([undefined, false, "unknown"])("falls back to untagged control when the flag answers %s (kill switch)", (answer) => {
    const t = setup({ answer });
    t.fire();
    expect(t.h1.innerHTML).toBe(CONTROL_HTML);
    expect(t.root.dataset[H1_VARIANT_DATASET_KEY]).toBeUndefined();
    expect(t.root.classList.removed).toContain(H1_PENDING_CLASS);
  });

  it("does nothing, and does not read the flag, without consent", () => {
    const t = setup({ answer: "category", consented: false });
    t.fire();
    expect(t.calls).toEqual([]);
    expect(t.h1.innerHTML).toBe(CONTROL_HTML);
    expect(t.root.dataset[H1_VARIANT_DATASET_KEY]).toBeUndefined();
    expect(t.root.classList.removed).toContain(H1_PENDING_CLASS);
  });

  it("reveals control straight away when PostHog is missing or blocked", () => {
    const t = setup({ noPosthog: true });
    expect(t.h1.innerHTML).toBe(CONTROL_HTML);
    expect(t.root.classList.removed).toContain(H1_PENDING_CLASS);
  });

  it("reveals control on timeout and ignores a late answer (no late swap, no exposure)", () => {
    const t = setup({ answer: "category" });
    t.timeout();
    t.fire();
    expect(t.calls).toEqual([]);
    expect(t.h1.innerHTML).toBe(CONTROL_HTML);
    expect(t.root.dataset[H1_VARIANT_DATASET_KEY]).toBeUndefined();
    expect(t.root.classList.removed).toContain(H1_PENDING_CLASS);
  });

  it("settles only once", () => {
    const t = setup({ answer: "category" });
    t.fire();
    t.fire();
    t.timeout();
    expect(t.calls).toEqual([H1_FLAG_KEY]);
  });

  it("does not tag category when there is no category text", () => {
    const t = setup({ answer: "category", categoryHtml: undefined });
    t.fire();
    expect(t.h1.innerHTML).toBe(CONTROL_HTML);
    expect(t.root.dataset[H1_VARIANT_DATASET_KEY]).toBeUndefined();
  });

  it("falls back to control when PostHog throws", () => {
    const root = { dataset: {} as Record<string, string | undefined>, classList: { remove: () => {} } };
    const h1 = { innerHTML: CONTROL_HTML };
    runHeroH1Experiment({
      root, h1, categoryHtml: CATEGORY_HTML, consented: true,
      posthog: { onFeatureFlags: () => { throw new Error("boom"); }, getFeatureFlag: () => "category" },
      setTimer: () => {},
    });
    expect(h1.innerHTML).toBe(CONTROL_HTML);
    expect(root.dataset[H1_VARIANT_DATASET_KEY]).toBeUndefined();
  });
});

describe("category copy", () => {
  it("exists in both locales as one sentence and differs from control", () => {
    for (const locale of ["en", "vi"] as const) {
      const text = HOME_H1_CATEGORY[locale];
      expect(text.trim().length).toBeGreaterThan(0);
      expect(text.match(/[.!?]/g)).toHaveLength(1);
      expect(text).not.toBe(HOME[locale].hero.title);
    }
  });
});

// The click handlers are inline scripts, so they cannot be imported; pin the contract instead:
// both read the shared dataset key and attach `h1_variant` to exactly the hero and app events.
describe("analytics event contract", () => {
  const read = (p: string) => readFileSync(new URL(`../src/components/layout/${p}`, import.meta.url), "utf8");

  it("PostHog adds h1_variant to hero_cta_clicked and app_cta_clicked only", () => {
    const src = read("PosthogAnalytics.astro");
    expect(src).toContain("H1_VARIANT_DATASET_KEY");
    expect(src).toMatch(/hero_cta_clicked", Object\.assign\(\{ cta: heroCta \}, ctaProps\)/);
    expect(src).toMatch(/app_cta_clicked", ctaProps/);
    expect(src).toMatch(/h1_variant: h1Variant/);
    expect(src).toMatch(/pricing_plan_cta_clicked", Object\.assign\(\{ plan: link\.dataset\.trackPlan \}, props\)/);
  });

  it("GTM adds h1_variant to both dataLayer events", () => {
    const src = read("GoogleTagManager.astro");
    expect(src).toContain("H1_VARIANT_DATASET_KEY");
    expect(src).toMatch(/heroEvent\.h1_variant = h1Variant/);
    expect(src).toMatch(/appEvent\.h1_variant = h1Variant/);
  });
});
