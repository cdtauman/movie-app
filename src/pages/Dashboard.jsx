import React, { useState, useEffect } from "react";
import { Movie } from "../entities/Movie";
import { UserMovieInteraction } from "../entities/UserMovieInteraction";
import { TrendingUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";

import MovieCard from "../components/movies/MovieCard";
import MovieDetails from "../components/movies/MovieDetails";

const TRENDING_MOVIES = [
  {
    title: "Barbie",
    overview: "Barbie and Ken are having the time of their lives...",
    release_date: "2023-07-21",
    poster_url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=450&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=400&fit=crop",
    genres: ["Comedy", "Adventure"],
    vote_average: 7.1,
    tmdb_id: 346698,
    trailer_url: "https://www.youtube.com/watch?v=pBk4NYhWNMM"
  },
  {
    title: "John Wick: Chapter 4",
    overview: "With the price on his head ever increasing...",
    release_date: "2023-03-24",
    poster_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=400&fit=crop",
    genres: ["Action", "Thriller"],
    vote_average: 7.8,
    tmdb_id: 603692,
    trailer_url: "https://www.youtube.com/watch?v=qEVUtrk8_B4"
  }
];

export default function Dashboard() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userInteractions, setUserInteractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const existingMovies = await Movie.list("created_at", 12);
      if (existingMovies.length < 4) {
        await addCuratedMovies();
      } else {
        setTrendingMovies(existingMovies.slice(0, 12));
      }

      const interactions = await UserMovieInteraction.list();
      setUserInteractions(interactions);
    } catch (error) {
      console.error("Error loading:", error);
    }
    setIsLoading(false);
  };

  const addCuratedMovies = async () => {
    for (const movieData of TRENDING_MOVIES) {
      const exists = await Movie.filter({ tmdb_id: movieData.tmdb_id });
      if (exists.length === 0) {
        await Movie.create(movieData);
      }
    }
    const movies = await Movie.list("created_at", 12);
    setTrendingMovies(movies);
  };

  const handleMovieClick = (movie) => setSelectedMovie(movie);

  const handleAddToWatchlist = async (movie) => {
    const exists = userInteractions.find(
      (i) => i.movie_id === movie.id && i.interaction_type === "watchlist"
    );
    if (!exists) {
      await UserMovieInteraction.create({
        movie_id: movie.id,
        interaction_type: "watchlist"
      });
      const updated = await UserMovieInteraction.list();
      setUserInteractions(updated);
    }
  };

  const handleMarkWatched = async (movie) => {
    const exists = userInteractions.find(
      (i) => i.movie_id === movie.id && i.interaction_type === "watched"
    );
    if (!exists) {
      await UserMovieInteraction.create({
        movie_id: movie.id,
        interaction_type: "watched",
        watched_date: new Date().toISOString().split("T")[0]
      });
      const updated = await UserMovieInteraction.list();
      setUserInteractions(updated);
    }
  };

  const isWatched = (movieId) =>
    userInteractions.some((i) => i.movie_id === movieId && i.interaction_type === "watched");

  const isInWatchlist = (movieId) =>
    userInteractions.some((i) => i.movie_id === movieId && i.interaction_type === "watchlist");

  return (
    <div className="min-h-screen cinema-gradient">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Discover Your Next <span className="text-cinema-gold">Favorite Movie</span>
          </h1>
          <p className="text-lg text-cinema-text-muted mb-6">
            Explore trending titles and refresh suggestions anytime.
          </p>
          <Button
            size="lg"
            onClick={addCuratedMovies}
            className="bg-cinema-gold text-black px-6 py-3 font-semibold rounded shadow-md hover:bg-yellow-400"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Refresh Movies
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-cinema-gold" />
            <h2 className="text-2xl font-bold text-white">Trending Now</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-700 aspect-[2/3] rounded-lg mb-3"></div>
                  <div className="bg-gray-600 h-4 w-3/4 rounded mb-1"></div>
                  <div className="bg-gray-600 h-3 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trendingMovies.map((movie, index) => (
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