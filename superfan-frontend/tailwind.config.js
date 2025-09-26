/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // scan everything inside src
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1", // indigo
        secondary: "#14B8A6", // teal
        dark: "#0f0f0f",
        light: "#f5f5f5",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
