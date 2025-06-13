import React, { useState } from "react";

export default function MovieSearch({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [minRating, setMinRating] = useState("");

  const handleSearch = () => {
    const filters = {
      query: query.trim(),
      genre: genre.trim(),
      year: year.trim(),
      min_rating: minRating.trim()
    };

    // Validate year
    if (filters.year && (!/^\d{4}$/.test(filters.year))) {
      alert("Year must be a 4-digit number");
      return;
    }

    // Validate rating
    if (filters.min_rating && isNaN(Number(filters.min_rating))) {
      alert("Min rating must be a valid number");
      return;
    }

    onSearch(filters);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg mb-8 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">Title</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Inception"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Genre</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g. Action"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2023"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Min Rating</label>
          <input
            type="number"
            step="0.1"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            placeholder="e.g. 7.5 (0–10)"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className={`px-6 py-2 rounded font-semibold transition ${
            isLoading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-cinema-gold text-black hover:bg-yellow-400"
          }`}
        >
          {isLoading ? "Searching..." : "Search Movies"}
        </button>
      </div>
    </div>
  );
}
