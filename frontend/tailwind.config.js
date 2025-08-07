/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust if your files are elsewhere
  ],
  theme: {
    extend: {
      colors: {
        coffee: "#6f4e37", // deep brown
        crema: "#fffaf0", // soft off-white
        espresso: "#4b3621", // darker coffee tone
        mocha: "#a9746e", // lighter brown
        foam: "#e8ded2", // creamy light beige
        caramel: "#c19a6b", // tan shade
        sidebar: "var(--sidebar)",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"], // you can customize this
      },
    },
  },
  darkMode: "class", // Optional: remove if not needed
  plugins: [],
};
