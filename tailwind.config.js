/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-tertiary": "var(--bg-tertiary)",

        // Card backgrounds
        "card-light": "var(--card-light)",
        "card-warm": "var(--card-warm)",
        "card-lavender": "var(--card-lavender)",

        // Brand / Primary
        "brand-primary": "var(--brand-primary)",
        "brand-primary-light": "var(--brand-primary-light)",
        "brand-primary-pale": "var(--brand-primary-pale)",

        // Accent colours
        "accent-warm": "var(--accent-warm)",
        "accent-calm": "var(--accent-calm)",
        "accent-fresh": "var(--accent-fresh)",
        "accent-soft": "var(--accent-soft)",

        // Text
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-inverse": "var(--text-inverse)",

        // Borders
        "border-light": "var(--border-light)",
        "border-med": "var(--border-med)",
        "border-accent": "var(--border-accent)",
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #3D31C4 0%, #6C5CE7 100%)',
        'soft-card-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #F9F7FE 100%)',
        'warm-card-gradient': 'linear-gradient(135deg, #FFFBF5 0%, #F9F7FE 100%)',
        'accent-warm-gradient': 'linear-gradient(135deg, #F4A261 0%, #F87171 100%)',
        'success-gradient': 'linear-gradient(135deg, #10B981 0%, #48CAE4 100%)',
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",     // 16px
        "3xl": "1.25rem",  // 20px
        full: "9999px"
      },
      boxShadow: {
        'soft':       '0 4px 16px rgba(0, 0, 0, 0.08)',
        'medium':     '0 12px 32px rgba(0, 0, 0, 0.12)',
        'hover':      '0 8px 24px rgba(0, 0, 0, 0.10)',
        'pressed':    '0 2px 8px rgba(0, 0, 0, 0.06)',
        'glow-warm':  '0 0 24px rgba(244, 162, 97, 0.20)',
        'glow-indigo':'0 0 24px rgba(61, 49, 196, 0.15)',
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "sans-serif"],
        body:    ["Inter", "sans-serif"],
        accent:  ["Playfair Display", "serif"],
        data:    ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        pulseRing: {
          '0%':   { transform: 'scale(1)',   boxShadow: '0 0 0 0 rgba(244, 162, 97, 0.7)' },
          '50%':  { transform: 'scale(1.2)', boxShadow: '0 0 0 10px rgba(244, 162, 97, 0)' },
          '100%': { transform: 'scale(1)',   boxShadow: '0 0 0 0 rgba(244, 162, 97, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      animation: {
        'pulse-ring': 'pulseRing 2s infinite',
        'float':      'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.4s ease-out both',
        'shimmer':    'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
}
