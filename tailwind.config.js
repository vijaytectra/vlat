/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.html", "./pages/**/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#8d191c",
        secondary: "#f3f4f6",
        "secondary-yellow": "#fff6e2",
        background: "#F8F7F0",
        "beige-light": "#FBF9F2",
        grey: {
          1: "#fafafa",
          2: "#f5f5f5",
          3: "#f5f5f5",
          4: "#d4d4d4",
          5: "#a3a3a3",
          6: "#737373",
          7: "#525252",
          8: "#404040",
          9: "#262626",
          10: "#171717",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
