module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--background)",
          rgb: "var(--background-rgb)",
          light: "rgba(var(--background-rgb), 0.5)",
        },
        foreground: {
          DEFAULT: "var(--foreground)",
          dark: "rgba(var(--foreground-rgb), 0.7)",
        },
        theme: {
          DEFAULT: "var(--theme)",
          rgb: "var(--theme-rgb)",
          dark: "rgba(var(--theme-rgb), 0.3)",
        },
      },
      scale: {
        '102': '1.02'
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};