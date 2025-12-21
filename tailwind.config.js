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
        amber: {
          200: "#EDCD88",
        },
        red: {
          600: "#EE0006",
          800: "#8D191C",
        },
        rose: {
          800: "#983033",
        },
        yellow: {
          50: "#FFF6E2",
        },
        teal: {
          600: "#009689",
          700: "#00A63E",
        },
        green: {
          100: "#DCFCE7",
          300: "#7AF1A7",
          600: "#008236",
          700: "#00A63E",
        },
        orange: {
          100: "#FFEDD4",
          300: "#FFB869",
        },
        purple: {
          100: "#F3E8FF",
          300: "#D9B1FF",
          600: "#9810FA",
        },
        slate: {
          200: "#E1E8F0",
          300: "#CAD5E2",
          600: "#45556C",
          700: "#314157",
          900: "#0E162B",
        },
      },
      backdropBlur: {
        blur: "8px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
