const API_KEY  = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * מחזיר כתובת YouTube של הטריילר הראשי (אם קיים) לסרט מסוים.
 */
async function fetchTrailerUrl(movieId) {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
  );
  if (!res.ok) return null;

  const data = await res.json();
  const trailer = data.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
}

/**
 * חיפוש סרטים + שליפת טריילר. 
 * @param {string}  query       – מחרוזת חיפוש
 * @param {string}  [year]      – סינון שנה (YYYY)
 * @param {number} [min_rating] – ציון מינימלי (0-10)
 * @returns {Promise<Array>}    – מערך אובייקטים מוכנים לאפליקציה
 */
export async function searchMovies(query, year = "", min_rating = "") {
  const url = `${BASE_URL}/search/movie?query=${encodeURIComponent(
    query
  )}&api_key=${API_KEY}&language=he-IL`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("TMDB search failed");
  const data = await res.json();

  // סינון בסיסי
  const filtered = data.results.filter(
    (m) =>
      (!year || m.release_date?.startsWith(year)) &&
      (!min_rating || m.vote_average >= parseFloat(min_rating))
  );

  // שליפת טריילרים במקביל
  return Promise.all(
    filtered.map(async (m) => {
      const trailer_url = await fetchTrailerUrl(m.id);
      return {
        title:         m.title,
        overview:      m.overview,
        release_date:  m.release_date,
        poster_url:    m.poster_path
          ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
          : "",
        backdrop_url:  m.backdrop_path
          ? `https://image.tmdb.org/t/p/w780${m.backdrop_path}`
          : "",
        genres:        [],                // תוכל למלא בהמשך
        vote_average:  m.vote_average,
        tmdb_id:       m.id,
        trailer_url,                      // *** חדש! ***
      };
    })
  );
}
