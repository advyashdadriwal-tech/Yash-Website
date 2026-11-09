/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0b1a2e",
          soft: "#1c2d45",
          muted: "#5b6779",
        },
        ivory: {
          DEFAULT: "#f7f4ee",
          deep: "#efeae0",
        },
        brass: {
          DEFAULT: "#a8823f",
          light: "#c9a96a",
        },
        rule: "#ddd5c6",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
}
