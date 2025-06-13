import React, { useEffect, useState } from "react";
import { UserMovieInteraction } from "../entities/UserMovieInteraction";
import { Movie } from "../entities/Movie";
import MovieCard from "../components/movies/MovieCard";
import MovieDetails from "../components/movies/MovieDetails";
import { motion } from "framer-motion";
import { Bookmark, Eye } from "lucide-react";

export default function Profile() {
  const [userInteractions, setUserInteractions] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      const interactions = await UserMovieInteraction.list();
      setUserInteractions(interactions);
      const movieIds = interactions.map((i) => i.movie_id);
      const allMovies = await Movie.list();
      const relevantMovies = allMovies.filter((m) => movieIds.includes(m.id));
      setMovies(relevantMovies);
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
    setIsLoading(false);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleMarkWatched = async (movie) => {
    try {
      const existing = userInteractions.find(
        (i) => i.movie_id === movie.id && i.interaction_type === 'watched'
      );
      if (existing) {
        await UserMovieInteraction.remove(existing.id);
      } else {
        await UserMovieInteraction.create({
          movie_id: movie.id,
          interaction_type: 'watched',
          watched_date: new Date().toISOString().split('T')[0],
        });
      }
      await loadProfileData();
    } catch (err) {
      console.error('Error updating watched:', err);
    }
  };

  const handleAddToWatchlist = async (movie) => {
    try {
      const existing = userInteractions.find(
        (i) => i.movie_id === movie.id && i.interaction_type === 'watchlist'
      );
      if (existing) {
        await UserMovieInteraction.remove(existing.id);
      } else {
        await UserMovieInteraction.create({
          movie_id: movie.id,
          interaction_type: 'watchlist',
        });
      }
      await loadProfileData();
    } catch (err) {
      console.error('Error updating watchlist:', err);
    }
  };

  const isWatched = (movieId) =>
    userInteractions.some((i) => i.movie_id === movieId && i.interaction_type === "watched");

  const isInWatchlist = (movieId) =>
    userInteractions.some((i) => i.movie_id === movieId && i.interaction_type === "watchlist");

  const watchedMovies = movies.filter((m) => isWatched(m.id));
  const watchlistMovies = movies.filter((m) => isInWatchlist(m.id));

  return (
    <div className="min-h-screen cinema-gradient">
      <div className="container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-8 h-8 text-cinema-gold" />
            <h1 className="text-4xl font-bold text-white">Watched Movies</h1>
          </div>
          {isLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : watchedMovies.length === 0 ? (
            <p className="text-cinema-text-muted">You haven't marked any movies as watched.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {watchedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onMovieClick={handleMovieClick}
                  onAddToWatchlist={handleAddToWatchlist}
                  onMarkWatched={handleMarkWatched}
                  isWatched={true}
                  isInWatchlist={isInWatchlist(movie.id)}
                />
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Bookmark className="w-8 h-8 text-cinema-gold" />
            <h1 className="text-4xl font-bold text-white">My Watchlist</h1>
          </div>
          {isLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : watchlistMovies.length === 0 ? (
            <p className="text-cinema-text-muted">You haven't added any movies to your watchlist.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {watchlistMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onMovieClick={handleMovieClick}
                  onAddToWatchlist={handleAddToWatchlist}
                  onMarkWatched={handleMarkWatched}
                  isWatched={isWatched(movie.id)}
                  isInWatchlist={true}
                />
              ))}
            </div>
          )}
        </motion.div>

        {selectedMovie && (
          <MovieDetails
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            onAddToWatchlist={handleAddToWatchlist}
            onMarkWatched={handleMarkWatched}
            isWatched={isWatched(selectedMovie.id)}
            isInWatchlist={isInWatchlist(selectedMovie.id)}
          />
        )}
      </div>
    </div>
  );
}