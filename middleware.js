import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Upstash envs exist
const hasUpstashEnv =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

let apiLimiter = null;
let pageLimiter = null;

// Initialize rate limiters only if envs are available
if (hasUpstashEnv) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  apiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests/min for API
  });

  pageLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"), // 30 requests/min for pages
  });
}

export async function middleware(request) {
  // If no envs → skip rate limiting
  if (!hasUpstashEnv) {
    return NextResponse.next();
  }

  const url = new URL(request.url);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1";

  // Detect route type
  const isAPI = url.pathname.startsWith("/api");
  const limiter = isAPI ? apiLimiter : pageLimiter;

  // Limit by user IP (or userId if authenticated)
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
