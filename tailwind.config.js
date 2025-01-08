module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--background)",
          rgb: "var(--background-rgb)",
        },
        foreground: "var(--foreground)",
        theme: {
          DEFAULT: "var(--theme)",
          rgb: "var(--theme-rgb)",
          dark: "rgba(var(--theme-rgb), 0.3)",
        },
      },
      scale: {
        '102': '1.02'
      }
    },
  },
  plugins: [],
};