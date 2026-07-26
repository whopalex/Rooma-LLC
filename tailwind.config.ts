import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Colors sampled directly from the real Hotmart checkout being replicated.
        checkout: {
          navy: "#0C1723", // page backdrop behind the white card
          blue: "#2B55A6", // countdown/urgency bar
          green: "#00992B", // primary CTA / discount accents
          "green-light": "#F0FBF5",
          cream: "#F5F3EF", // guarantee-badges section background
          gray: "#7A7773", // secondary/muted text, sampled from the real checkout
          dark: "#0D0D0D", // primary text on the white card, sampled from the real checkout
        },
        brand: {
          DEFAULT: "#00992B",
          dark: "#007A22",
          ink: "#0C1723",
        },
      },
    },
  },
  plugins: [],
};

export default config;
