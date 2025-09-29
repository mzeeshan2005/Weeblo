"use server";

export const getAnimeEpisodeServers = async (epId) => {
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_ANIWATCH_URL}/api/v2/hianime/episode/servers?animeEpisodeId=${epId}`,
    {
      next: {
        revalidate: 60 * 60 * 24,
      },
    }
  );
  const data = await resp.json();
  return data.data;
};
export const getAnimeEpisodeServerLink = async (
  epId,
  server = "hd-2",
  category = "sub"
) => {
  try {
    /*const resp = await fetch(
      `${process.env.NEXT_PUBLIC_ANIME_URL}/api/stream?id=${epId}&server=${server}&type=${category}`,
      {
        cache: "no-store",
      }
    );
    const data = await resp.json();
    const results = {
      sources: [
        {
          url: data.results.streamingLink.link.file,
          type: data.results.streamingLink.link.type,
        },
      ],
      tracks: [...data.results.streamingLink.tracks],
      intro: data.results.streamingLink.intro,
      outro: data.results.streamingLink.outro,
    };
    if (data.success != true) {
      throw new Error("Failed to fetch episode server link");
    }
    return results;*/

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_ANIWATCH_URL}/api/v2/hianime/episode/sources?animeEpisodeId=${epId}&server=${server}&category=${category}`,
      {
        cache: "no-store",
      }
    );
    const data = await resp.json();
    return data.data;

  } catch (error) {
    server = "hd-2";

    const resp = await fetch(`https://yumaapi.vercel.app/watch?episodeId=${epId.replace('?ep=', '$episode$')}&type=${category}`)
    const data = await resp.json();
    if (!data) {
      throw new Error("Failed to fetch episode server link");
    }
    const results = {
      sources: [
        {
          url: data.sources[0].url,
          type: data.sources.isM3U8 ? "m3u8" : "video/mp4",
        },
      ],
      tracks: [...data.subtitles],
      intro: data.intro,
      outro: data.outro,
    };

    return results;
  }
};
