import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("daisyui")],
};

const daisyConfig = {
  ...config,
  daisyui: {
    themes: [
      {
        oneflow: {
          "primary": "#2563EB",        // Blue 600 - trust & productivity
          "secondary": "#0EA5E9",      // Sky 500 - accent
          "accent": "#22C55E",         // Green 500 - success
          "neutral": "#1E293B",        // Slate 800 - text
          "base-100": "#FFFFFF",       // White - cards/surfaces
          "base-200": "#F8FAFC",       // Slate 50 - background
          "base-300": "#E2E8F0",       // Slate 200 - borders
          "info": "#3B82F6",           // Blue 500
          "success": "#22C55E",        // Green 500
          "warning": "#F59E0B",        // Amber 500
          "error": "#EF4444",          // Red 500
          "base-content": "#1E293B",   // Slate 800 - main text
        },
        oneflowDark: {
          "primary": "#3B82F6",        // Brighter blue for dark
          "secondary": "#38BDF8",      // Sky 400
          "accent": "#22C55E",         // Green 500
          "neutral": "#1E293B",        // Slate 800
          "base-100": "#0F172A",       // Slate 900 - background
          "base-200": "#1E293B",       // Slate 800 - cards
          "base-300": "#334155",       // Slate 700 - borders
          "info": "#3B82F6",
          "success": "#22C55E",
          "warning": "#FACC15",        // Yellow 400
          "error": "#F87171",          // Red 400
          "base-content": "#F8FAFC",   // Slate 50 - main text
        },
      },
    ],
    darkTheme: "oneflowDark",
    base: true,
    styled: true,
    utils: true,
  },
};

export default daisyConfig;

