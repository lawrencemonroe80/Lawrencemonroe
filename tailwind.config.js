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
          /* Hyper-realistic metallurgy (§9) */
          hi: "#FCF6BA",
          core: "#D4AF37",
          aged: "#AA771C",
          brushA: "#BF953F",
          brushB: "#B38728",
          brushC: "#FBF5B7",
          wire: "#5B4812",
        },
        silver: {
          DEFAULT: "#A6A6A2",
          hi: "#F4F4F0",
          lo: "#6E6E68",
        },
        archive: {
          red: "#743530",
        },
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
      /* §9 physical lighting — top-left 45° key, layered depth */
      boxShadow: {
        material:
          '0px 20px 50px -10px rgba(0, 0, 0, 0.9), 0px 2px 4px 0px rgba(0, 0, 0, 0.95), inset 0px 1px 1px 0px rgba(255, 255, 255, 0.15), inset 0px -1px 1px 0px rgba(0, 0, 0, 0.8)',
        'material-deep':
          '0px 28px 70px -12px rgba(0, 0, 0, 0.92), 0px 4px 8px 0px rgba(0, 0, 0, 0.9), inset 0px 1px 1px 0px rgba(255, 255, 255, 0.15), inset 0px -1px 1px 0px rgba(0, 0, 0, 0.8)',
        'metal-glow': '0px 0px 12px rgba(212, 175, 55, 0.25)',
      },
      backgroundImage: {
        'gold-hi':
          'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
        'gold-wire': 'linear-gradient(180deg, #D4AF37 0%, #5B4812 100%)',
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
