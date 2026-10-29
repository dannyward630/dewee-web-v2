import { describe, expect, it, vi } from "vitest";
import { createPage } from "../../src/lib/server/pages/page-service";
import { handleResults, handleVote, VOTE_LIMITS } from "../../src/lib/server/post-widget-votes/vote-handler";
import { csvCell, surveyCsv, widgetReport } from "../../src/lib/server/post-widget-votes/admin-report";
import { VOTER_COOKIE } from "../../src/lib/server/post-widget-votes/voter";
import { memoryKv, sqliteD1 } from "../helpers/sqlite-d1";
import { poll, quiz, survey } from "./interactive-fixtures";

vi.mock("cloudflare:workers", () => ({ env: {} }));

const SITE = "https://dewee.sh";
const body = 'Intro\n\n::widget{id="poll-1"}\n\n::widget{id="quiz-1"}\n\n::widget{id="survey-1"}';

async function setup(opts: { status?: "draft" | "published"; blocks?: unknown[] } = {}) {
  const { d1, raw } = sqliteD1();
  const { kv } = memoryKv();
  const post = await createPage(d1, "post", { title: "Votes", slug: "votes", status: opts.status ?? "published", body_md: body, blocks: opts.blocks ?? [poll, quiz, survey] }, { actor: "test" });
  return { env: { DB: d1, KV: kv }, raw, post };
}

type VoteOpts = { cookie?: string; origin?: string | null; ip?: string; form?: boolean; fetchSite?: string };

function voteRequest(payload: Record<string, unknown>, opts: VoteOpts = {}) {
  const headers = new Headers({ "cf-connecting-ip": opts.ip ?? "203.0.113.7" });
  if (opts.origin !== null) headers.set("origin", opts.origin ?? SITE);
  if (opts.fetchSite) headers.set("sec-fetch-site", opts.fetchSite);
  if (opts.cookie) headers.set("cookie", `${VOTER_COOKIE}=${opts.cookie}`);
  if (opts.form) {
    headers.set("content-type", "application/x-www-form-urlencoded");
    const form = new URLSearchParams();
    for (const [k, v] of Object.entries(payload)) for (const item of Array.isArray(v) ? v : [v]) form.append(k, String(item));
    return new Request(`${SITE}/api/post-widgets/vote`, { method: "POST", headers, body: form.toString() });
  }
  headers.set("content-type", "application/json");
  return new Request(`${SITE}/api/post-widgets/vote`, { method: "POST", headers, body: JSON.stringify(payload) });
}

const cookieFrom = (res: Response) => /__Host-dewee_voter=([0-9a-f]{32})/.exec(res.headers.get("set-cookie") ?? "")?.[1];

async function results(env: Awaited<ReturnType<typeof setup>>["env"], postId: string, cookie?: string) {
  const headers = cookie ? { cookie: `${VOTER_COOKIE}=${cookie}` } : undefined;
  const res = await handleResults(new Request(`${SITE}/api/post-widgets/results?post=${postId}`, { headers }), env);
  return { status: res.status, data: (await res.json()) as { widgets: Record<string, Record<string, unknown>> } };
}

describe("POST /api/post-widgets/vote", () => {
  it("stores a valid vote, sets a functional cookie and keeps only a hash of it", async () => {
    const { env, raw, post } = await setup();
    const res = await handleVote(voteRequest({ post: post.id, widget: "poll-1", choice: "yes" }), env);
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toMatch(/^__Host-dewee_voter=[0-9a-f]{32}; Path=\/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax$/);
    const data = (await res.json()) as { ok: boolean; result: { total: number; voted: boolean; choice: string } };
    expect(data).toMatchObject({ ok: true, result: { type: "Poll", voted: true, choice: "yes", total: 1 } });
    const rows = raw.prepare("SELECT * FROM widget_responses").all() as Record<string, unknown>[];
    expect(rows).toHaveLength(1);
    const cookie = cookieFrom(res)!;
    expect(rows[0].voter).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(rows)).not.toContain(cookie);
    expect(JSON.stringify(rows)).not.toContain("203.0.113.7");
    expect(Object.keys(rows[0]).sort()).toEqual(["answers", "choice", "created_at", "id", "post_id", "updated_at", "voter", "widget_id", "widget_type"]);
  });

  it("rejects unknown options, unknown widgets and other posts' widgets", async () => {
    const { env, post } = await setup();
    const bad = await handleVote(voteRequest({ post: post.id, widget: "poll-1", choice: "maybe" }), env);
    expect(bad.status).toBe(400);
    expect(await bad.json()).toMatchObject({ ok: false, error: "invalid", message: 'Unknown option "maybe".' });
    expect((await handleVote(voteRequest({ post: post.id, widget: "nope", choice: "yes" }), env)).status).toBe(404);
    const other = await createPage(env.DB, "post", { title: "Other", slug: "other", status: "published", body_md: "No widgets." }, { actor: "test" });
    expect((await handleVote(voteRequest({ post: other.id, widget: "poll-1", choice: "yes" }), env)).status).toBe(404);
    expect((await results(env, other.id)).data.widgets).toEqual({});
  });

  it("refuses unpublished posts", async () => {
    const { env, post } = await setup({ status: "draft" });
    const res = await handleVote(voteRequest({ post: post.id, widget: "poll-1", choice: "yes" }), env);
    expect(res.status).toBe(404);
    expect((await results(env, post.id)).status).toBe(404);
  });

  it("lets a reader change a poll vote but keeps one row", async () => {
    const { env, raw, post } = await setup();
    const first = await handleVote(voteRequest({ post: post.id, widget: "poll-1", choice: "yes" }), env);
    const cookie = cookieFrom(first)!;
    const second = await handleVote(voteRequest({ post: post.id, widget: "poll-1", choice: "no" }, { cookie }), env);
    expect(second.status).toBe(200);
    expect(second.headers.get("set-cookie")).toBeNull();
    expect(await second.json()).toMatchObject({ result: { choice: "no", total: 1 } });
    expect(raw.prepare("SELECT COUNT(*) AS n FROM widget_responses").get()).toEqual({ n: 1 });
  });

  it("keeps the first quiz answer and reveals the answer only after answering", async () => {
    const { env, post } = await setup();
    const before = await results(env, post.id);
    expect(before.data.widgets["quiz-1"]).toEqual({ type: "Quiz", closed: false, answered: false });
    const first = await handleVote(voteRequest({ post: post.id, widget: "quiz-1", choice: "no" }), env);
    const cookie = cookieFrom(first)!;
    expect(await first.json()).toMatchObject({ ok: true, result: { answered: true, choice: "no", answer: "yes", correct: false, explanation: quiz.props.explanation } });
    const again = await handleVote(voteRequest({ post: post.id, widget: "quiz-1", choice: "yes" }, { cookie }), env);
    expect(again.status).toBe(409);
    expect(await again.json()).toMatchObject({ ok: false, error: "already_answered" });
    const after = await results(env, post.id, cookie);
    expect(after.data.widgets["quiz-1"]).toMatchObject({ answered: true, choice: "no", answer: "yes", total: 1 });
    // Another reader still does not see the answer.
    expect((await results(env, post.id)).data.widgets["quiz-1"]).toEqual({ type: "Quiz", closed: false, answered: false });
  });

  it("returns only aggregates, and never survey answers", async () => {
    const { env, post } = await setup();
    await handleVote(voteRequest({ post: post.id, widget: "poll-1", choice: "yes" }), env);
    await handleVote(voteRequest({ post: post.id, widget: "poll-1", choice: "yes" }), env);
    await handleVote(voteRequest({ post: post.id, widget: "poll-1", choice: "no" }), env);
    const res = await handleVote(voteRequest({ post: post.id, widget: "survey-1", answers: { role: "eng", wish: "secret wish" } }), env);
    expect(await res.json()).toEqual({ ok: true, result: { type: "Survey", closed: false, answered: true } });
    const { data } = await results(env, post.id);
    expect(data.widgets["poll-1"]).toEqual({
      type: "Poll", closed: false, voted: false, choice: null, total: 3,
      options: [{ id: "yes", label: "Yes", count: 2, percent: 67 }, { id: "no", label: "No", count: 1, percent: 33 }],
    });
    expect(data.widgets["survey-1"]).toEqual({ type: "Survey", closed: false, answered: false });
    expect(JSON.stringify(data)).not.toMatch(/secret wish|eng|voter/);
  });

  it("refuses closed widgets", async () => {
    const { env, post } = await setup({ blocks: [{ ...poll, props: { ...poll.props, closesAt: "2020-01-01T00:00:00Z" } }, quiz, survey] });
    const res = await handleVote(voteRequest({ post: post.id, widget: "poll-1", choice: "yes" }), env);
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ error: "closed" });
    expect((await results(env, post.id)).data.widgets["poll-1"]).toMatchObject({ closed: true });
  });

  it("rate-limits per voter and per network", async () => {
    const { env, post } = await setup();
    const first = await handleVote(voteRequest({ post: post.id, widget: "poll-1", choice: "yes" }), env);
    const cookie = cookieFrom(first)!;
    for (let i = 1; i < VOTE_LIMITS.voter; i++) expect((await handleVote(voteRequest({ post: post.id, widget: "poll-1", choice: "yes" }, { cookie }), env)).status).toBe(200);
    const limited = await handleVote(voteRequest({ post: post.id, widget: "poll-1", choice: "no" }, { cookie }), env);
    expect(limited.status).toBe(429);
    expect(limited.headers.get("retry-after")).toBe(String(VOTE_LIMITS.windowSeconds));

    const ip = "198.51.100.9";
    for (let i = 0; i < VOTE_LIMITS.ip; i++) expect((await handleVote(voteRequest({ post: post.id, widget: "poll-1", choice: "yes" }, { ip }), env)).status).toBe(200);
    expect((await handleVote(voteRequest({ post: post.id, widget: "poll-1", choice: "yes" }, { ip }), env)).status).toBe(429);
  });

  it("checks the origin like the admin writes do", async () => {
    const { env, post } = await setup();
    const payload = { post: post.id, widget: "poll-1", choice: "yes" };
    expect((await handleVote(voteRequest(payload, { origin: "https://evil.example" }), env)).status).toBe(403);
    expect((await handleVote(voteRequest(payload, { origin: null }), env)).status).toBe(403);
    expect((await handleVote(voteRequest(payload, { origin: null, fetchSite: "cross-site" }), env)).status).toBe(403);
    expect((await handleVote(voteRequest(payload, { origin: null, fetchSite: "same-origin" }), env)).status).toBe(200);
  });

  it("answers a plain form post with a results page that links back to the widget", async () => {
    const { env, post } = await setup();
    const res = await handleVote(voteRequest({ post: post.id, widget: "quiz-1", choice: "yes" }, { form: true }), env);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    expect(res.headers.get("set-cookie")).toContain(VOTER_COOKIE);
    const html = await res.text();
    expect(html).toContain("Answer saved");
    expect(html).toContain("Correct.");
    expect(html).toContain(quiz.props.explanation);
    expect(html).toContain('href="/blog/votes#pw-quiz-1"');
    const bad = await handleVote(voteRequest({ post: post.id, widget: "poll-1" }, { form: true }), env);
    expect(bad.status).toBe(400);
    expect(await bad.text()).toContain("Pick an answer first.");
  });
});

describe("admin survey report", () => {
  it("aggregates choices, lists free text and exports safe CSV", async () => {
    const { env, post } = await setup();
    await handleVote(voteRequest({ post: post.id, widget: "survey-1", answers: { role: "eng", topics: ["a", "b"], wish: "=HYPERLINK(\"x\")" } }), env);
    await handleVote(voteRequest({ post: post.id, widget: "survey-1", answers: { role: "ops", topics: ["a"] } }), env);
    const report = await widgetReport(env.DB, post.id, "survey-1");
    expect(report?.responses).toBe(2);
    const [role, topics, wish] = report!.questions!;
    expect(role.options).toEqual([{ id: "eng", label: "Engineering", count: 1, percent: 50 }, { id: "ops", label: "Ops", count: 1, percent: 50 }]);
    expect(topics.options?.map((o) => o.percent)).toEqual([100, 50]);
    expect(wish.texts?.map((t) => t.text)).toEqual(['=HYPERLINK("x")']);
    const csv = surveyCsv(report!);
    expect(csv.split("\r\n")[0]).toBe('"submitted_at","Role?","Topics?","Anything else?"');
    expect(csv).toContain(`"'=HYPERLINK(""x"")"`);
    expect(csv).toContain('"Engineering","A; B"');
    expect(csvCell("@cmd")).toBe(`"'@cmd"`);
    expect(await widgetReport(env.DB, post.id, "missing")).toBeNull();
  });
});
