import type { Config } from 'tailwindcss';


const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#101014',
          surface: '#18181C',
          border: '#252529',
          text: '#D9D9D9',
          muted: '#8E8E93',
        },
        light: {
          bg: '#F8F9FC',
          surface: '#FFFFFF',
          border: '#E2E8F0',
          text: '#0F172A',
          muted: '#64748B',
        },
        amber: {
          primary: '#FFB800',
          hover: '#FFC933',
          glow: 'rgba(255, 184, 0, 0.18)',
          lightPrimary: '#D97706',
          lightHover: '#B45309',
        },
      },
      fontFamily: {
        heading: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'amber-glow': '0 0 25px rgba(255, 184, 0, 0.18)',
        'amber-glow-lg': '0 0 40px rgba(255, 184, 0, 0.28)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite alternate',
      },
      keyframes: {
        'pulse-glow': {
          '0%': { boxShadow: '0 0 10px rgba(255, 184, 0, 0.1)' },
          '100%': { boxShadow: '0 0 25px rgba(255, 184, 0, 0.35)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
