import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Superfícies (tema escuro técnico)
        bg: "#08080c",
        bg2: "#0d0d13",
        surface: "#131319",
        surface2: "#1a1a23",
        line: "#26262f",
        line2: "#34343f",
        fg: "#f2f2f7",
        muted: "#9a9aac",
        faint: "#63636f",
        // Acento — violeta elétrico
        brand: {
          50: "#f0edff",
          100: "#e3ddff",
          200: "#c9bfff",
          300: "#a99bff",
          400: "#8b7cff",
          500: "#7c6cff", // acento
          600: "#6d5efc",
          700: "#5a4de0",
          800: "#4a3fb8",
          900: "#3d3593",
        },
        accent2: "#22d3ee",
        sale: "#fb7185",
        good: "#34d399",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,108,255,.35), 0 16px 44px -14px rgba(124,108,255,.5)",
        soft: "0 1px 2px rgba(0,0,0,.4), 0 20px 46px -22px rgba(0,0,0,.7)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.15rem",
      },
    },
  },
  plugins: [],
};

export default config;
