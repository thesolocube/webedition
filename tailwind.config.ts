import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: "#E50914",
        dark: "#0F0F0F",
        "dark-elevated": "#141414",
        "dark-card": "#1a1a1a",
      },
    },
  },
  plugins: [],
};
export default config;
