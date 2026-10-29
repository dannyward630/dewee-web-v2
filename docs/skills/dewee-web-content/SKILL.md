---
name: dewee-web-content
description: Create or update dewee.sh custom pages (/p/<slug>), blog posts and media through the dewee-web CLI or the remote MCP server at https://dewee.sh/mcp. Use when asked to publish an announcement, write a blog post, build a landing page from blocks, or upload an image to cdn.dewee.sh.
---

# dewee.sh content operator

The site's hand-built pages live in code (this repo). Custom pages (`/p/<slug>`) and blog posts
(`/blog/<slug>`) live in D1 and are edited through the API. This skill covers only the second kind.

## Before you start

1. You need an API key with the smallest scopes that fit: `pages:read|write`,
   `posts:read|write`, `media:write`, `leads:read`. Only the four super-admins can create keys
   at `https://dewee.sh/admin/keys`. Never print the key or paste it into a file in a repo.
2. Pick one interface:
   - **CLI:** `npx -y dewee-web <command>` with `DEWEE_WEB_API_KEY` in the environment. Add
     `DEWEE_WEB_URL=https://staging.dewee.sh` to try on staging first.
   - **MCP:** remote `https://dewee.sh/mcp` with `Authorization: Bearer <key>`, or the stdio
     bridge `npx -y dewee-web mcp`. `tools/list` shows only what your scopes allow.
3. Read `https://dewee.sh/developers` once. The API reference is `/api/v1/openapi.json`.

## Workflow

1. **Look first.** `pages list` / `posts list` (MCP: `list_pages`, `list_posts`). Update an
   existing slug instead of creating a near-duplicate.
2. **Blocks, not HTML.** `blocks list`, then `blocks schema <Type>` (MCP: `list_blocks`,
   `get_block_schema`). Pages accept registered block types only; props are validated.
3. **Posts are Markdown, with widgets between paragraphs.** `blocks list --context post`
   (MCP: `list_blocks` with `context: "post"`) lists them: Gallery, Video, VideoEmbed
   (YouTube/Vimeo), SocialCard, CodeBlock, plus Image, Callout, Quote, Steps, Timeline, Faq,
   Columns and Divider. Give each block an `id`, then put a line `::widget{id="…"}` on its own
   where it goes; blocks you do not place show after the body. The CLI reads them from the file
   named by `blocks:` in the front matter (or `--blocks`). Validate first with
   `POST /api/v1/blocks/validate` and `{ "context": "post", "blocks": [...], "body_md": "…" }`.
   Interactive widgets: Poll (readers may change their vote), Quiz (one answer; the `answer` and
   `explanation` are shown only after the reader answers, never in the page or the Markdown) and
   Survey (one submission; results and free text only at `/admin/widgets`, with CSV export).
   These three need an `id`, because answers are stored per post and widget id: keep the id and
   the option ids stable once a post is live, or earlier answers stop counting. Demo embeds a
   sandboxed page (`allow-scripts` only) from an allowlisted host (codepen.io, jsfiddle.net),
   loaded only when the reader clicks; any other host is rejected.
   Charts and diagrams are not widgets yet: use a Callout or Steps with the numbers in words.
   A worked sample is in `examples/widget-post.md` and `examples/widget-post.blocks.json`.
4. **Write both languages.** Every page or post gets an EN and a VI version that share a
   `translation_key`. The Vietnamese is written for Vietnamese readers, not machine-translated.
   Pricing in VI is Self-install and On-Premises only.
5. **Save as a draft** (drafts are not public; a super-admin can open the live preview in
   `/admin`). Publish, then check the public URL at 375 px and 1440 px in light and dark. Pass
   `--version <n>` on updates; a `409 conflict` means someone saved first: re-read, merge, retry.
6. **Media:** `media upload <file>` (PNG, JPEG, WebP, GIF, AVIF, up to 10 MB) returns a
   `cdn.dewee.sh` URL. Every image needs real alt text, gallery images included. Videos are
   `.mp4`/`.webm` files on https or `/media/`, with `.vtt` captions when there is speech.
7. **Report** the published URLs (EN and VI) and anything you could not verify.

## Content rules

- **Facts only.** Numbers, features and release items come from the dewee repo, the changelog or
  `/features`. No invented customers, quotes, metrics or logos. If a claim is unverified, leave
  it out or ask.
- **Say what is true by default.** The way in starts shut (a token to connect, approval before a
  stranger can chat, private networks blocked). Agent capabilities start open and are narrowed
  by the operator. Prompt-injection checks warn by default. Do not write "closed by default"
  about the whole product.
- **Voice:** warm, plain, a little wry; short sentences; "we" for NextLevelBuilder, "you" for
  the reader. EN is the default locale.
- Keep titles under 60 characters and descriptions under 160; the site builds OG cards,
  `.md` twins and `llms.txt` entries from them.
- Never unpublish or delete someone else's page without being asked. Restoring a revision
  (`list_revisions`, `restore_revision`) is the safe undo.
