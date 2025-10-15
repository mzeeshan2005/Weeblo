"use server";
import { NextResponse } from "next/server";
export const POST = async (req) => {
  const { prompt, type } = await req.json();
  let content;
  if (type == "string") {
    content = {
      "type": "text", "text": `Recommend exactly 10 anime that are related to the prompt: '${prompt}'. 

STRICT REQUIREMENTS:
- Return ONLY a valid JSON object with no additional text, explanations, or formatting
- JSON format must be exactly: {"anime_recommendations": ["Anime 1", "Anime 2", "Anime 3", "Anime 4", "Anime 5", "Anime 6", "Anime 7"]}
- Do NOT include any anime mentioned in the original prompt
- Use official English titles only (no Japanese titles, no romaji)
- Include mature/18+ content if relevant to the recommendation
- Ensure all recommendations are genuinely related to the prompt's theme
- Do not number the items in the array
- Do not include any trailing commas in the JSON`};
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
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          {
            role: "user",
            content: [content],
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
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          {
            role: "user",
            content: [content],
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
