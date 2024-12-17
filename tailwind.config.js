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
          50: '#121212',    // Darkest background
          100: '#1E1E1E',   // Dark background
          200: '#2C2C2C',   // Slightly lighter dark background
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
