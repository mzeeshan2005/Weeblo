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
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_ANIWATCH_URL}/api/v2/hianime/episode/sources?animeEpisodeId=${epId}&server=${server}&category=${category}`,
      {
        next: {
          revalidate: 3600,
        },
        cache: "force-cache",
      }
    );
    const data = await resp.json();
    if (data.status != 200 || data.success != true) {
      throw new Error("Failed to fetch episode server link");
    }
    return data.data;
  } catch (error) {
    server = "hd-2";
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_ANIME_URL}/api/stream?id=${epId}&server=${server}&type=${category}`,
      {
        next: {
          revalidate: 3600,
        },
        cache: "force-cache",
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
    return results;
  }
};
