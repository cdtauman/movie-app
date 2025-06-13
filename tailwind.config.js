/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "cinema-gold": "#FFD700",
        "cinema-text-muted": "#aaa",
        "cinema-gray": "#1e1e1e",
      },
    },
  },
  plugins: [],
};
