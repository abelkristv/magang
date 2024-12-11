/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', // JIT (Just-in-Time) mode for fast builds and smaller CSS size
  content: [
    "./index.html",                // Vite's entry point is `index.html` in the root
    "./src/**/*.{js,ts,jsx,tsx}",  // Matches all JS/TS/JSX/TSX files in the `src` directory
  ],
  theme: {
    extend: {}, // You can extend the default Tailwind theme here
  },
  plugins: [], // Add Tailwind plugins here if needed
};
