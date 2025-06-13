# Movie App

A simple React + Vite application for discovering movies. You can search TMDB, view trending titles and manage a personal watch list. Data is stored locally and in a Supabase database.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with your API keys. Example:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_KEY=public_anon_key
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Features

- Browse curated trending movies
- Search by title, year and rating
- Save movies to your watch list and mark as watched
- Profile page shows your watch list and watched movies

The project uses Tailwind CSS for styling and Framer Motion for basic animations.