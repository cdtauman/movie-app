import React, { useState, useEffect } from "react";
import { Movie } from "../entities/Movie";
import { UserMovieInteraction } from "../entities/UserMovieInteraction";
import { searchMovies } from "../utils/searchMovies";
import { motion } from "framer-motion";
import { Search as SearchIcon, Sparkles } from "lucide-react";

import MovieSearch from "../components/movies/MovieSearch";
import MovieCard from "../components/movies/MovieCard";
import MovieDetails from "../components/movies/MovieDetails";

export default function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userInteractions, setUserInteractions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadUserInteractions();
  }, []);

  const loadUserInteractions = async () => {
    try {
      const interactions = await UserMovieInteraction.list();
      setUserInteractions(interactions);
    } catch (error) {
      console.error("Error loading user interactions:", error);
    }
  };

  const handleSearch = async (filters) => {
    if (!filters.query && !filters.genre && !filters.year && !filters.min_rating) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const movies = await searchMovies(filters.query, filters.year, filters.min_rating);

      const savedMovies = [];
      for (const movieData of movies) {
        try {
          const existing = await Movie.filter({ tmdb_id: movieData.tmdb_id });
          if (existing.length > 0) {
            savedMovies.push(existing[0]);
          } else {
            const saved = await Movie.create(movieData);
            if (saved) {
              savedMovies.push(saved);
            }
          }
        } catch (error) {
          console.error("Error saving movie:", error);
        }
      }

      setSearchResults(savedMovies);
    } catch (error) {
      console.error("Error searching TMDB:", error);
      setSearchResults([]);
    }

    setIsLoading(false);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleAddToWatchlist = async (movie) => {
    try {
      const existing = userInteractions.find(
        i => i.movie_id === movie.id && i.interaction_type === "watchlist"
      );

      if (existing) {
        await UserMovieInteraction.remove(existing.id);
      } else {
        await UserMovieInteraction.create({
          movie_id: movie.id,
          interaction_type: "watchlist"
        });
      }

      const updated = await UserMovieInteraction.list();
      setUserInteractions(updated);
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    }
  };

  const handleMarkWatched = async (movie) => {
    try {
      const existing = userInteractions.find(
        i => i.movie_id === movie.id && i.interaction_type === "watched"
      );

      if (existing) {
        await UserMovieInteraction.remove(existing.id);
      } else {
        await UserMovieInteraction.create({
          movie_id: movie.id,
          interaction_type: "watched",
          watched_date: new Date().toISOString().split('T')[0]
        });
      }

      const updated = await UserMovieInteraction.list();
      setUserInteractions(updated);
    } catch (error) {
      console.error("Error toggling watched:", error);
    }
  };

  const isWatched = (movieId) => {
    return userInteractions.some(i => i.movie_id === movieId && i.interaction_type === "watched");
  };

  const isInWatchlist = (movieId) => {
    return userInteractions.some(i => i.movie_id === movieId && i.interaction_type === "watchlist");
  };

  return (
    <div className="min-h-screen cinema-gradient">
      <div className="container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <SearchIcon className="w-8 h-8 text-cinema-gold" />
            <h1 className="text-4xl font-bold text-white">Search Movies</h1>
          </div>
          <p className="text-xl text-cinema-text-muted">
            Find your perfect movie with advanced search and filtering options.
          </p>
        </motion.div>

        <MovieSearch onSearch={handleSearch} isLoading={isLoading} />

        {hasSearched && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Search Results {searchResults.length > 0 && `(${searchResults.length})`}
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array(10).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-cinema-gray aspect-[2/3] rounded-lg mb-4"></div>
                    <div className="bg-cinema-gray h-4 rounded mb-2"></div>
                    <div className="bg-cinema-gray h-3 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {searchResults.map((movie, index) => (
                  <motion.div
                    key={movie.tmdb_id || movie.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MovieCard
                      movie={movie}
                      onMovieClick={handleMovieClick}
                      onAddToWatchlist={handleAddToWatchlist}
                      onMarkWatched={handleMarkWatched}
                      isWatched={isWatched(movie.id)}
                      isInWatchlist={isInWatchlist(movie.id)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-cinema-text-muted mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">No movies found</h3>
                <p className="text-cinema-text-muted">
                  Try adjusting your search criteria or search for different terms.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {!hasSearched && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center py-20">
            <Sparkles className="w-20 h-20 text-cinema-gold mx-auto mb-6" />
            <h3 className="text-3xl font-semibold text-white mb-4">Ready to Discover?</h3>
            <p className="text-xl text-cinema-text-muted max-w-md mx-auto">
              Use the search above to find movies by title, genre, year, or rating.
            </p>
          </motion.div>
        )}

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
