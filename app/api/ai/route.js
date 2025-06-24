"use server";
import { NextResponse } from "next/server";
export const POST = async (req) => {
  const { prompt, type } = await req.json();
  let content;
  if (type == "string") {
    content = `Based on the following : ${prompt}, recommend just 7 similar or related animes. Do NOT include any of the given animes in the result. Respond ONLY in this exact JSON format: { "anime_recommendations": ["Anime Name 1", "Anime Name 2", ...] } Use official English titles only. No Japanese titles, no romaji. Strictly return only the JSON object so that i can parse it successfully — no extra text, explanation, or formatting.`;
  }
  try {
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY1}`,
        "HTTP-Referer": "https://weeblo.vercel.app/",
        "X-Title": "Weeblo",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/devstral-small:free",
        messages: [
          {
            role: "user",
            content: content,
          },
        ],
      }),
      cache: "no-cache",
    });
    const data = await resp.json();
    return NextResponse.json({
      status: 200,
      body: { message: data?.choices[0]?.message?.content },
    });
  } catch (error) {
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY2}`,
        "HTTP-Referer": "https://weeblo.vercel.app/",
        "X-Title": "Weeblo",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/devstral-small:free",
        messages: [
          {
            role: "user",
            content: content,
          },
        ],
      }),
      cache: "no-cache",
    });
    const data = await resp.json();
    return NextResponse.json({
      status: 200,
      body: { message: data?.choices[0]?.message?.content },
    });
  }
};
