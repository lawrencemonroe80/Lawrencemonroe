/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        black: "#050505",
        graphite: "#171717",
        ash: "#303030",
        bone: "#E7E1D7",
        paper: "#F1ECE3",
        smoke: "#9A958D",
        /* Canonical campaign palette (DESIGN_FRAMEWORK.md §0) */
        void: "#0D0D0D",
        concrete: "#888888",
        bleach: "#F4F4F0",
        line: "rgba(231, 225, 215, 0.17)",
        "line-dark": "rgba(10, 10, 10, 0.12)",
        gold: {
          DEFAULT: "#AD8A48",
          soft: "#C4A565",
          dark: "#60471E",
        },
        archive: {
          red: "#743530",
        },
        silver: "#A6A6A2",
      },
      fontFamily: {
        display: ['Syne', 'Anton', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Italiana', 'serif'],
        sans: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        condensed: ['Anton', 'Syne', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tightest: '-0.08em',
        widest: '0.25em',
        ultra: '0.35em',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
