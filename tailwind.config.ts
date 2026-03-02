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
        pink: {
          50: "#fff1f7",
          100: "#ffe4f1",
          200: "#ffcfe6",
          300: "#ffb3d9",
          400: "#ff7ab6",
          500: "#f43f9a",
        },
        "error-soft": "#e8b4b8",
        "error-soft-text": "#9b4d52",
      },
    },
  },
  plugins: [],
};
export default config;
