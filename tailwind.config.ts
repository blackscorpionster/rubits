import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "bounce-slow": "bounce 1.5s infinite",
        "spin-slow": "spin 5s linear infinite",
        "spin-slow-reverse": "spin-reverse 5s linear infinite",
        "pulse-fast": "pulse 0.7s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "spin-reverse": {
          to: { transform: "rotate(-360deg)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
