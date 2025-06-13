export async function InvokeLLM({ prompt, add_context_from_internet = false, response_json_schema }) {
  console.log("🧠 Invoking LLM with prompt:");
  console.log(prompt);
  
  // Simulate LLM returning structured movie data
  return {
    movies: [
      {
        title: "Inception",
        overview: "A thief who steals corporate secrets through the use of dream-sharing technology...",
        release_date: "2010-07-16",
        poster_url: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
        backdrop_url: "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
        genres: ["Action", "Sci-Fi"],
        vote_average: 8.8,
        tmdb_id: 27205
      },
      {
        title: "Interstellar",
        overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        release_date: "2014-11-07",
        poster_url: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        backdrop_url: "https://image.tmdb.org/t/p/w1280/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
        genres: ["Adventure", "Drama", "Sci-Fi"],
        vote_average: 8.6,
        tmdb_id: 157336
      }
    ]
  };
}