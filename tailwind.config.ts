import type { Config } from "tailwindcss";

/**
 * Design tokens pulled straight from the Fit Log Figma file.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: { DEFAULT: "#c2f800", tint: "#1a2312" },
        page: { DEFAULT: "#0f1115", home: "#0c0d10", footer: "#090a0d" },
        // Home page surfaces
        card: { DEFAULT: "#15171d", line: "#222630", image: "#1f232b" },
        // Detail page surfaces
        panel: { DEFAULT: "#151922", media: "#171a21", line: "#232834" },
        // My Plan surfaces
        plan: {
          card: "#14171e",
          metric: "#13161d",
          tabs: "#151921",
          tab: "#1f242d",
          "tab-line": "#2b303d",
          line: "#232732",
          empty: "#111317",
        },
        rule: { header: "#1c1f26", footer: "#1a1d24", chip: "#2d313b", btn: "#374151" },
        ink: {
          muted: "#9ca3af",
          plan: "#8a92a0",
          subtle: "#6b7280",
          soft: "#d1d5db",
          soft2: "#e5e7eb",
          empty: "#a1a1aa",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "Oswald", "Impact", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        media: "0 25px 50px -12px rgba(0,0,0,0.25)",
        glow: "0 4px 6px -4px rgba(194,241,13,0.1), 0 10px 15px -3px rgba(194,241,13,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
