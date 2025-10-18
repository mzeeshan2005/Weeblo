import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});

const pageLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
});

export async function middleware(request) {
  const url = new URL(request.url);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1";

  // Detect route type
  const isAPI = url.pathname.startsWith("/api");
  const limiter = isAPI ? apiLimiter : pageLimiter;

  // Identify unique user — can also be userId if logged in
  const identifier = ip;

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // Apply to all routes
};
