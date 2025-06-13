import { supabase } from "../supabase";

const ALLOWED_SORT_FIELDS = ["created_at", "title", "vote_average"];

export const Movie = {
  async create(movieData) {
    if (!movieData || !movieData.tmdb_id) {
      console.error("Missing tmdb_id in movieData");
      return null;
    }

    // בודק אם הסרט כבר קיים לפי tmdb_id
    const { data: existing, error: findError } = await supabase
      .from("movies")
      .select("*")
      .eq("tmdb_id", movieData.tmdb_id)
      .maybeSingle();

    if (findError) {
      console.error("Error checking existing movie:", findError.message);
      return null;
    }

    if (existing) return existing;

    // ניקוי ערכים לא תקינים לפני שליחה למסד
    const clean = { ...movieData };

    // אם release_date ריק או רווחים - מוחקים
    if (!clean.release_date || clean.release_date.trim() === "") {
      delete clean.release_date;
    }

    // אם vote_average לא מספר תקין - מוחקים
    if (
      clean.vote_average === "" ||
      clean.vote_average === null ||
      clean.vote_average === undefined
    ) {
      delete clean.vote_average;
    }

    // שליחת הסרט למסד
    const { data, error } = await supabase
      .from("movies")
      .insert([clean]) // ← שימוש באובייקט המסונן
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error inserting movie:", error.message);
      return null;
    }

    return data;
  },

  async list(sortBy = "created_at", limit = 20) {
    if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
      console.warn("Invalid sortBy value:", sortBy);
      sortBy = "created_at";
    }

    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .order(sortBy, { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error listing movies:", error.message);
      return [];
    }

    return data;
  },

  async filter(filters = {}) {
    let query = supabase.from("movies").select("*");

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error filtering movies:", error.message);
      return [];
    }

    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error getting movie by ID:", error.message);
      return null;
    }

    return data;
  }
};
