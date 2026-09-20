/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── CORE PALETTE — black & white dominate ──
        black: "#000000",
        ink: "#0A0A0A",
        ash: "#1A1A1A",
        iron: "#333333",
        steel: "#666666",
        smoke: "#999999",
        bone: "#FFFFFF",
        white: "#FFFFFF",

        // ── GOLD PRIMARY ──
        gold: {
          DEFAULT: "#C79F3D",
          light: "#E8C76E",
          pale: "#F4E2A1",
          deep: "#8E6F22",
          shadow: "#5A4416",
          soft: "#D9B86A",
        },

        // ── ACCENTS ──
        indigo: "#3D5089",
        brown: "#683B16",

        // ── LEGACY ALIASES (kept for compatibility) ──
        graphite: "#0A0A0A",
        void: "#0A0A0A",
        concrete: "#666666",
        bleach: "#FFFFFF",
        paper: "#FFFFFF",
        line: "rgba(255, 255, 255, 0.07)",
        "line-strong": "rgba(255, 255, 255, 0.14)",
        "line-dark": "rgba(17, 17, 17, 0.12)",
        "line-gold": "rgba(199, 159, 61, 0.35)",
        archive: {
          red: "#683B16",
        },
      },
      fontFamily: {
        // Display — PP Editorial New italic (hero statements)
        display: ['"PP Editorial New"', '"Playfair Display"', '"Times New Roman"', 'serif'],
        'display-roman': ['"PP Editorial New"', '"Playfair Display"', '"Times New Roman"', 'serif'],
        // UI — Inter Tight: very clean modern grotesk
        sans: ['"Inter Tight"', '"Inter"', 'system-ui', 'sans-serif'],
        ui: ['"Inter Tight"', '"Inter"', 'system-ui', 'sans-serif'],
        body: ['"Inter Tight"', '"Inter"', 'system-ui', 'sans-serif'],
        // Folio / metadata — Inter Tight (uppercase tabular)
        folio: ['"Inter Tight"', '"Inter"', 'sans-serif'],
        // Editorial serif for italic accents (kept as alias)
        editorial: ['"PP Editorial New"', '"Playfair Display"', 'serif'],
        'editorial-display': ['"PP Editorial New"', '"Playfair Display"', 'serif'],
        'display-tight': ['"PP Editorial New"', '"Playfair Display"', 'serif'],
        serif: ['"PP Editorial New"', '"Playfair Display"', 'serif'],
        // Satoshi (Fontshare) for secondary accents
        kinetic: ['"Satoshi"', '"Inter Tight"', 'sans-serif'],
        mono: ['"Inter Tight"', '"Space Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.06em',
        tighter: '-0.04em',
        tight: '-0.025em',
        normal: '0em',
        wider: '0.04em',
        wide: '0.08em',
        widest: '0.22em',
        ultra: '0.4em',
      },
      fontSize: {
        // Dramatic editorial scale
        'giant': 'clamp(4rem, 16vw, 18rem)',
        'colossal': 'clamp(3.5rem, 13vw, 14rem)',
        'monumental': 'clamp(3rem, 9vw, 10rem)',
        'massive': 'clamp(2.5rem, 7vw, 7rem)',
        'hero': 'clamp(2rem, 5vw, 5rem)',
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'drift': 'drift 12s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'reveal': 'reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'gold-shimmer': 'gold-shimmer 9s ease-in-out infinite',
      },
      boxShadow: {
        'soft': '0 20px 50px -20px rgba(0, 0, 0, 0.5)',
        'gold-glow': '0 0 40px rgba(199, 159, 61, 0.15)',
        'gold-strong': '0 0 60px rgba(199, 159, 61, 0.25)',
        // Realistic glass shadows — layered depth
        'glass': 'inset 0 1px 0 0 rgba(255,255,255,0.08), inset 0 -1px 0 0 rgba(0,0,0,0.20), 0 20px 60px -20px rgba(0,0,0,0.5)',
        'glass-deep': 'inset 0 1px 0 0 rgba(255,255,255,0.10), inset 0 -1px 0 0 rgba(0,0,0,0.30), 0 40px 100px -20px rgba(0,0,0,0.7)',
      },
      backgroundImage: {
        // Realistic metallic gold gradient
        'gold-sheen': 'linear-gradient(135deg, #F4E2A1 0%, #E8C76E 18%, #C79F3D 38%, #8E6F22 55%, #C79F3D 72%, #E8C76E 88%, #F4E2A1 100%)',
        'gold-radial': 'radial-gradient(circle at 30% 30%, #F4E2A1 0%, #E8C76E 20%, #C79F3D 50%, #8E6F22 100%)',
        'gold-line': 'linear-gradient(90deg, transparent 0%, rgba(199,159,61,0.6) 25%, rgba(232,199,110,0.9) 50%, rgba(199,159,61,0.6) 75%, transparent 100%)',
        // Editorial fade overlays
        'editorial-fade': 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
        'editorial-fade-up': 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 60%)',
        'editorial-fade-down': 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
        // Subtle noise grain
        'noise': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.02)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gold-shimmer': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
    maxWidth: {
      'editorial': '1760px',
      'reading': '68ch',
    },
  },
  plugins: [],
}
