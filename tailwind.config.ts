import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Assinatura M3D — cobalto/índigo profundo (premium, técnico)
        brand: {
          50: "#eef0ff",
          100: "#e0e3ff",
          200: "#c6ccff",
          300: "#a3a9ff",
          400: "#7f80fb",
          500: "#635df2",
          600: "#4b3fe4", // primária
          700: "#3d2fc9",
          800: "#3229a2",
          900: "#2c2780",
        },
        // Neutros escolhidos — carvão levemente frio + porcelana
        ink: {
          50: "#f6f6f9",
          100: "#ececf1",
          200: "#d9dae3",
          300: "#b7b9c9",
          400: "#8d8fa6",
          500: "#6b6d86",
          600: "#53556c",
          700: "#414258",
          800: "#2b2c3d",
          900: "#191926",
          950: "#101019",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,16,25,.04), 0 10px 30px -12px rgba(16,16,25,.12)",
        lift: "0 2px 4px rgba(16,16,25,.05), 0 18px 40px -16px rgba(75,63,228,.28)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
