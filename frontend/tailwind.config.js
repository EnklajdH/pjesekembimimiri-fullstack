/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#080808",
          red: "#dc2626"
        }
      }
    },
  },
  plugins: [],
};
