import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// Shared prefix used in auth.ts and sign-in/actions.ts to signal a rate-limit error
// from inside NextAuth's authorize() callback.
export const TOO_MANY_ATTEMPTS_PREFIX = "TooManyAttempts:" as const;

const isConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = isConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

function makeSlidingWindow(
  requests: number,
  window: `${number} ${"s" | "m" | "h" | "d"}`
): Ratelimit | null {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: false,
  });
}

function makeFixedWindow(
  requests: number,
  window: `${number} ${"s" | "m" | "h" | "d"}`
): Ratelimit | null {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(requests, window),
    analytics: false,
  });
}

// Login uses fixedWindow so additional attempts after lockout don't push the reset time forward.
export const loginLimiter = makeFixedWindow(5, "15 m");
export const registerLimiter = makeSlidingWindow(3, "1 h");
export const forgotPasswordLimiter = makeSlidingWindow(3, "1 h");
export const resetPasswordLimiter = makeSlidingWindow(5, "15 m");

/**
 * Extracts the real client IP.
 * Prefers x-real-ip (set by Vercel/Cloudflare, not spoofable by the client).
 * Falls back to the last segment of x-forwarded-for (most recently added by a trusted proxy).
 */
export function getIP(request: Request): string {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",");
    return parts[parts.length - 1].trim();
  }

  return "127.0.0.1";
}

async function _check(
  limiter: Ratelimit | null,
  key: string
): Promise<{ limited: false } | { limited: true; minutes: number; retryAfterSeconds: number }> {
  if (!limiter) return { limited: false };

  try {
    const { success, reset } = await limiter.limit(key);
    if (!success) {
      const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      const minutes = Math.ceil(retryAfterSeconds / 60);
      return { limited: true, minutes, retryAfterSeconds };
    }
    return { limited: false };
  } catch {
    // Fail open: allow request if Upstash is unavailable
    return { limited: false };
  }
}

/**
 * For API routes — returns a 429 NextResponse if rate-limited, null otherwise.
 * Includes Retry-After header.
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  key: string
): Promise<NextResponse | null> {
  const result = await _check(limiter, key);
  if (!result.limited) return null;

  return NextResponse.json(
    {
      error: `Too many attempts. Please try again in ${result.minutes} minute${result.minutes !== 1 ? "s" : ""}.`,
    },
    {
      status: 429,
      headers: { "Retry-After": String(result.retryAfterSeconds) },
    }
  );
}

/**
 * For NextAuth authorize() — returns an error message string if rate-limited, null otherwise.
 * Caller should: throw new Error(`${TOO_MANY_ATTEMPTS_PREFIX}${message}`)
 */
export async function checkRateLimitMessage(
  limiter: Ratelimit | null,
  key: string
): Promise<string | null> {
  const result = await _check(limiter, key);
  if (!result.limited) return null;

  return `Too many attempts. Please try again in ${result.minutes} minute${result.minutes !== 1 ? "s" : ""}.`;
}
