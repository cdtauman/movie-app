import React, { useState } from "react";
import { Play, Bookmark, Eye, X } from "lucide-react";
import { motion } from "framer-motion";

export default function MovieDetails({
  movie,
  onClose,
  onAddToWatchlist,
  onMarkWatched,
  isWatched,
  isInWatchlist
}) {
  const [showTrailer, setShowTrailer] = useState(false);

  const poster = movie.poster_url?.trim() ? movie.poster_url : null;
  const rating =
    movie.vote_average !== null && movie.vote_average !== undefined
      ? movie.vote_average.toFixed(1)
      : "N/A";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="relative bg-cinema-gray rounded-lg shadow-lg w-full max-w-4xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-50"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            {poster ? (
              <img
                src={poster}
                alt={movie.title}
                className="object-cover w-full h-full rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              />
            ) : (
              <div className="bg-gray-700 w-full h-full flex items-center justify-center text-white rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                No Poster
              </div>
            )}
          </div>

          <div className="md:w-2/3 p-6 space-y-4">
            <h2 className="text-3xl font-bold text-white">{movie.title}</h2>
            <p className="text-cinema-text-muted">{movie.overview}</p>

            <div className="flex flex-wrap gap-2 text-sm text-cinema-gold">
              {movie.genres?.map((genre, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-800 rounded">
                  {genre}
                </span>
              ))}
            </div>

            <div className="text-sm text-gray-400 space-y-1">
              <div>
                <strong>Release Date:</strong> {movie.release_date || "N/A"}
              </div>
              <div>
                <strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} min` : "N/A"}
              </div>
              <div>
                <strong>Rating:</strong> {rating} / 10
              </div>
              {movie.director && (
                <div>
                  <strong>Director:</strong> {movie.director}
                </div>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <strong>Cast:</strong> {movie.cast.join(", ")}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              {movie.trailer_url && (
                <button
                  onClick={() => setShowTrailer(!showTrailer)}
                  className="bg-cinema-gold text-black px-4 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition"
                >
                  <Play size={16} />
                  {showTrailer ? "Hide Trailer" : "Watch Trailer"}
                </button>
              )}

              <button
                onClick={() => onAddToWatchlist(movie)}
                className={`px-4 py-2 rounded flex items-center gap-2 transition ${
                  isInWatchlist
                    ? "bg-yellow-600 text-black"
                    : "bg-gray-700 text-white hover:bg-yellow-700"
                }`}
              >
                <Bookmark size={16} />
                {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </button>

              <button
                onClick={() => onMarkWatched(movie)}
                className={`px-4 py-2 rounded flex items-center gap-2 transition ${
                  isWatched
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-white hover:bg-green-700"
                }`}
              >
                <Eye size={16} />
                {isWatched ? "Watched" : "Mark as Watched"}
              </button>
            </div>

            {showTrailer && (
              <div className="mt-6 aspect-video w-full">
                <iframe
                  src={movie.trailer_url.replace("watch?v=", "embed/")}
                  title="Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
