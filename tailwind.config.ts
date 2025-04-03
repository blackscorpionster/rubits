import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lacquer: ["var(--font-lacquer)"],
      },
      animation: {
        "bounce-slow": "bounce 1.5s infinite",
        "spin-slow": "spin 5s linear infinite",
        "spin-slow-reverse": "spin-reverse 5s linear infinite",
        "pulse-fast": "pulse 0.7s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        fadeIn: "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        "spin-reverse": {
          to: { transform: "rotate(-360deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".text-shadow-outline": {
          "text-shadow":
            "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000",
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};

export default config;
