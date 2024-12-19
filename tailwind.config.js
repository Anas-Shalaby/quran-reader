/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#1A202C',
          100: '#2D3748',
          200: '#4A5568',
          300: '#3C3C3C',   // Dark card background
          400: '#4C4C4C',   // Dark input background
          500: '#6C6C6C',   // Dark muted text
          600: '#8C8C8C',   // Dark secondary text
          700: '#ACACAC',   // Light text on dark background
          800: '#CCCCCC',   // Lightest text
        }
      }
    },
  },
  plugins: [],
};