/**
 * Who is voting, without knowing who it is. A reader who answers a Poll, Quiz or Survey gets a
 * random first-party cookie (functional: it only stops double votes). D1 stores
 * HMAC(salt, post id + cookie id), so the stored key cannot be turned back into the cookie and
 * differs per post. Rate-limit keys use the same salt for the cookie and the client IP; they
 * live in KV for one window and the raw IP is never written anywhere.
 *
 * The salt is a random value the worker creates in D1 on first use (`widget_secrets`), so every
 * environment gets its own without a secret to provision.
 */
import { randomHex, toHex } from "../auth/crypto-helpers";

export const VOTER_COOKIE = "__Host-dewee_voter";
export const VOTER_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;
const VOTER_ID_RE = /^[0-9a-f]{32}$/;
const SALT_NAME = "voter-salt";
const enc = new TextEncoder();

/** The voter id from the request's Cookie header, when it is well formed. */
export function readVoterId(request: Request): string | null {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === VOTER_COOKIE) {
      const value = rest.join("=");
      return VOTER_ID_RE.test(value) ? value : null;
    }
  }
  return null;
}

export const newVoterId = (): string => randomHex(16);

export function voterCookie(id: string): string {
  return `${VOTER_COOKIE}=${id}; Path=/; Max-Age=${VOTER_COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`;
}

let cachedSalt: { db: D1Database; salt: string } | null = null;

/** The per-environment salt, created once (INSERT OR IGNORE keeps the first writer's value). */
export async function voterSalt(db: D1Database): Promise<string> {
  if (cachedSalt?.db === db) return cachedSalt.salt;
  await db.prepare("INSERT OR IGNORE INTO widget_secrets (name, value) VALUES (?, ?)").bind(SALT_NAME, randomHex(32)).run();
  const row = await db.prepare("SELECT value FROM widget_secrets WHERE name = ?").bind(SALT_NAME).first<{ value: string }>();
  if (!row?.value) throw new Error("voter salt unavailable");
  cachedSalt = { db, salt: row.value };
  return row.value;
}

export async function hmacHex(salt: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(salt), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toHex(new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(message))));
}

/** The stored voter key for one post. */
export const voterKey = (salt: string, postId: string, voterId: string) => hmacHex(salt, `voter:${postId}:${voterId}`);

/** Short keys for the KV rate-limit buckets (cookie and IP), never stored in D1. */
export async function rateKeys(salt: string, voterId: string, ip: string): Promise<{ voter: string; ip: string }> {
  const [voter, ipKey] = await Promise.all([hmacHex(salt, `rl-voter:${voterId}`), hmacHex(salt, `rl-ip:${ip}`)]);
  return { voter: voter.slice(0, 32), ip: ipKey.slice(0, 32) };
}
