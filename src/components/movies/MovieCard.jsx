import React, { useState } from "react";           // ⬅︎ הוספנו useState
import { Play, Eye, Star, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import TrailerModal from "../ui/TrailerModal";     // ⬅︎ ייבוא הקומפוננטה החדשה

export default function MovieCard({
  movie,
  onMovieClick,
  onAddToWatchlist,
  onMarkWatched,
  isWatched,
  isInWatchlist
}) {
  const [showTrailer, setShowTrailer] = useState(false);  // ⬅︎ סטייט לפתיחת מודאל

  /* 1) כרזה או Placeholder */
  const poster =
    movie.poster_url && movie.poster_url.trim() !== "" ? movie.poster_url : null;

  /* 2) ניקוד IMDb בטוח */
  const rating =
    movie.vote_average !== null && movie.vote_average !== undefined
      ? movie.vote_average.toFixed(1)
      : "N/A";

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="relative bg-cinema-gray rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all"
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          {poster ? (
            <img
              src={poster}
              alt={movie.title}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              onClick={() => onMovieClick(movie)}
            />
          ) : (
            <div
              onClick={() => onMovieClick(movie)}
              className="bg-gray-700 w-full h-full flex items-center justify-center text-gray-400 text-sm"
            >
              No Image
            </div>
          )}

          {/* כפתורי Watched / Watchlist */}
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <button
              title="Mark as Watched"
              onClick={(e) => {
                e.stopPropagation();
                onMarkWatched(movie);
              }}
              className={`p-2 rounded-full ${
                isWatched ? "bg-green-600" : "bg-gray-800 hover:bg-green-700"
              } text-white transition`}
            >
              <Eye size={16} />
            </button>
            <button
              title="Add to Watchlist"
              onClick={(e) => {
                e.stopPropagation();
                onAddToWatchlist(movie);
              }}
              className={`p-2 rounded-full ${
                isInWatchlist ? "bg-yellow-600" : "bg-gray-800 hover:bg-yellow-700"
              } text-white transition`}
            >
              <Bookmark size={16} />
            </button>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-sm text-cinema-text-muted line-clamp-2">
            {movie.overview}
          </p>

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-cinema-gold flex items-center gap-1">
              <Star className="w-4 h-4" />
              {rating}
            </span>

            {/* ⬇︎ כפתור טריילר חדש */}
            {movie.trailer_url ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTrailer(true);
                }}
                className="text-sm text-cinema-gold hover:text-yellow-400 transition flex items-center gap-1"
              >
                <Play className="w-4 h-4" />
                Trailer
              </button>
            ) : (
              /* fallback—חיפוש ביוטיוב אם אין טריילר */
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  movie.title
                )}+trailer`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-cinema-gold hover:text-yellow-400 transition flex items-center gap-1"
              >
                <Play className="w-4 h-4" />
                Trailer
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* ⬇︎ מודאל טריילר */}
      {showTrailer && (
        <TrailerModal
          videoUrl={movie.trailer_url}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </>
  );
}
