import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Upstash envs exist
const hasUpstashEnv =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Default or ENV-based limits
const API_LIMIT = parseInt(process.env.RATE_LIMIT_API || "100", 10); 
const PAGE_LIMIT = parseInt(process.env.RATE_LIMIT_PAGE || "200", 10);

let apiLimiter = null;
let pageLimiter = null;

if (hasUpstashEnv) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  apiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(API_LIMIT, "1 m"),
  });

  pageLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(PAGE_LIMIT, "1 m"),
  });
}

export async function middleware(request) {
  // Skip rate limiting if no Upstash setup
  if (!hasUpstashEnv) {
    return NextResponse.next();
  }

  const url = new URL(request.url);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1";

  const isAPI = url.pathname.startsWith("/api");
  const limiter = isAPI ? apiLimiter : pageLimiter;
  const identifier = ip;

  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    if (!success) {
      return new NextResponse(
        isAPI
          ? JSON.stringify({ error: "Too many requests, slow down." })
          : "You’re making too many requests — please wait a moment.",
        {
          status: 429,
          headers: {
            "Content-Type": isAPI ? "application/json" : "text/plain",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }
  } catch (error) {
    console.error("Rate limiter error:", error);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // Apply to all routes
};
