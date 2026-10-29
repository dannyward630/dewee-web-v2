import { describe, expect, it } from "vitest";
import { ApiError } from "../../src/lib/server/api/api-errors";
import { createPage, updatePage } from "../../src/lib/server/pages/page-service";
import { listPostMarkdown } from "../../src/lib/server/seo/dynamic-pages";
import { sqliteD1 } from "../helpers/sqlite-d1";
import { samplePost } from "./sample-post";

const ctx = { actor: "test" };

async function rejection(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise;
  } catch (err) {
    if (err instanceof ApiError) return err;
    throw err;
  }
  throw new Error("expected the write to fail");
}

describe("post writes", () => {
  it("stores a post with placed widgets and keeps block ids", async () => {
    const { d1 } = sqliteD1();
    const rec = await createPage(d1, "post", { title: "Widgets", slug: "widgets", ...samplePost() }, ctx);
    expect(rec.blocks.map((b) => b.id)).toContain("screens");
    expect(rec.blocks.find((b) => b.id === "screens")?.type).toBe("Gallery");
  });

  it("rejects directives that name no block, with the line", async () => {
    const { d1 } = sqliteD1();
    const err = await rejection(createPage(d1, "post", { title: "Bad", slug: "bad", body_md: 'Intro\n\n::widget{id="nope"}' }, ctx));
    expect(err.status).toBe(422);
    expect(err.details).toEqual([{ path: "body_md", message: expect.stringMatching(/^Line 3: no block has the id "nope"/) }]);
  });

  it("rejects page-only blocks in posts and post-only widgets on pages", async () => {
    const { d1 } = sqliteD1();
    const post = await rejection(createPage(d1, "post", { title: "P", slug: "p", blocks: [{ type: "PageHero", props: { title: "x" } }] }, ctx));
    expect(post.details).toEqual([expect.objectContaining({ path: "blocks.0.type" })]);
    const gallery = samplePost().blocks.find((b) => (b as { type: string }).type === "Gallery") as { type: string; props: unknown };
    const page = await rejection(createPage(d1, "page", { title: "Pg", slug: "pg", blocks: [{ type: gallery.type, props: gallery.props }] }, ctx));
    expect(page.details).toEqual([expect.objectContaining({ path: "blocks.0.type" })]);
  });

  it("validates the body against the blocks on update too", async () => {
    const { d1 } = sqliteD1();
    const rec = await createPage(d1, "post", { title: "U", slug: "u", body_md: "Plain" }, ctx);
    const err = await rejection(updatePage(d1, "post", rec.id, { body_md: 'Plain\n\n::widget{id="x"}' }, ctx));
    expect(err.status).toBe(422);
    const ok = await updatePage(d1, "post", rec.id, { body_md: 'Plain\n\n::widget{id="x"}', blocks: [{ id: "x", type: "Callout", props: { body: "Hi" } }] }, ctx);
    expect(ok.version).toBe(2);
  });
});

describe("llms-full post Markdown", () => {
  it("keeps old posts as written and turns widgets into text", async () => {
    const { d1 } = sqliteD1();
    const old = "Old post with `code`.\n\n```js\nconst a = 1;\n```\n";
    await createPage(d1, "post", { title: "Old", slug: "old", body_md: old, status: "published" }, ctx);
    await createPage(d1, "post", { title: "New", slug: "new", status: "published", ...samplePost() }, ctx);
    const posts = await listPostMarkdown(d1, "en");
    expect(posts.find((p) => p.path === "/blog/old")?.markdown).toBe(old);
    const fresh = posts.find((p) => p.path === "/blog/new")?.markdown ?? "";
    expect(fresh).toContain("![GoClaw logo](https://dewee.sh/img/ecosystem/goclaw.svg)");
    expect(fresh).toContain("[View on Bluesky](https://bsky.app/profile/dewee.sh/post/3l2example)");
  });
});
