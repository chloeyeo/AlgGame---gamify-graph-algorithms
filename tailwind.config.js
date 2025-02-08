/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      screens: {
        sm: "576px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: {
          100: "#EEEEEE",
          200: "#B6B6B6",
          300: "#888888",
          400: "#CCCCCC",
          500: "#e4e4e4",
          600: "#f1f1f4",
          700: "#dbdfe9",
          800: "#666666",
        },
        primary: {
          100: "#1139E8",
          200: "#3E7DDC",
          300: "#212121",
          400: "#FFFFFF",
        },
        blue: {
          100: "#3E7DDC",
          200: "#9BC3FF",
          300: "#C7DDFF",
        },
        sub: {
          100: "#555555",
          200: "#3C3C3C",
          300: "#E9EBEC",
          400: "#fcfcfc",
        },
      },
      boxShadow: {
        "custom-shadow": "4px 8px 4px rgba(0, 0, 0, 0.25)",
      },
      fontFamily: {
        dancing: ["Dancing Script", "cursive"],
        quicksand: ["Quicksand", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        "fade-in-1": "fadeIn 1s ease-out 0.5s forwards",
        "fade-in-2": "fadeIn 1s ease-out 1s forwards",
        bounce: "bounce 1s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(-5%)" },
          "50%": { transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: 0.7 },
          "50%": { opacity: 0.3 },
        },
      },
    },
    primary: {
      DEFAULT: "#1139E8",
      hover: "#3E7DDC",
    },
    secondary: {
      DEFAULT: "#EBE9E9",
      hover: "#D9D9D9",
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
