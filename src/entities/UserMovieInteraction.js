// חנות אינ־ממורי (לשימוש מקומי בלבד; ניתן להחליף ב-Supabase)
let interactionStore = [];
let nextId = 1;

const STORAGE_KEY = 'movieInteractions';

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      interactionStore = JSON.parse(raw);
      nextId = interactionStore.reduce((m, i) => Math.max(m, i.id), 0) + 1;
    }
  } catch (err) {
    interactionStore = [];
  }
}

function saveStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(interactionStore));
}

// Load stored data on module init
if (typeof window !== 'undefined') {
  loadStore();
}

export const UserMovieInteraction = {
  /** צור אינטראקציה (watchlist / watched) */
  async create({
    movie_id,
    interaction_type,      // "watched" | "watchlist"
    watched_date = null,
    user_id = null         // אופציונלי – אם תרצה תמיכה במשתמשים
  }) {
    // מחפשים אם כבר קיימת אותה אינטראקציה
    const exists = interactionStore.find(
      (entry) =>
        entry.movie_id === movie_id &&
        entry.interaction_type === interaction_type &&
        (user_id ? entry.user_id === user_id : true)
    );
    if (exists) return exists;

    const newInteraction = {
      id: nextId++,
      movie_id,
      interaction_type,
      watched_date,
      user_id,                          // נשמר אם יש
      created_date: new Date().toISOString()
    };

    interactionStore.push(newInteraction);
    saveStore();
    return newInteraction;
  },

  /** החזר רשימה מלאה */
  async list() {
    loadStore();
    return [...interactionStore];
  },

  /** סינון לפי שדות */
  async filter(filters = {}) {
    loadStore();
    return interactionStore.filter((entry) =>
      Object.entries(filters).every(
        ([key, value]) => entry[key] === value
      )
    );
  },

  /** החזר כל האינטראקציות של סרט מסוים */
  async getByMovie(movie_id, user_id = null) {
    loadStore();
    return interactionStore.filter(
      (entry) =>
        entry.movie_id === movie_id &&
        (user_id ? entry.user_id === user_id : true)
    );
  },

  /** ❌ מחיקה (לביטול סימון) */
  async remove(id) {
    const idx = interactionStore.findIndex((entry) => entry.id === id);
    if (idx === -1) return false;

    interactionStore.splice(idx, 1);
    saveStore();
    return true;
  }
};
