import type { Config } from 'tailwindcss'
import typographyPlugin from '@tailwindcss/typography'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '660px',
        md: '760px',
        lg: '960px',
        xl: '1200px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d9488', // Main Teal
          light: '#14b8a6',
          dark: '#0f766e',
          content: '#ffffff', // White text for primary backgrounds
        },
        secondary: {
          DEFAULT: '#0d7994', // Blue-Teal
          light: '#17a2b8', // Slightly lighter for hover effects
          dark: '#075985',
          content: '#ffffff',
        },
        accent: {
          DEFAULT: '#940d15', // Complementary Red
          light: '#b91c1c',
          dark: '#7f1d1d',
          content: '#ffffff',
        },
        neutral: {
          50: '#f8fafc', // slate-50
          100: '#f1f5f9', // slate-100 (Used as general background)
          200: '#e2e8f0', // slate-200
          300: '#cbd5e1', // slate-300
          400: '#94a3b8', // slate-400
          500: '#64748b', // slate-500 (Good for secondary text)
          600: '#475569', // slate-600
          700: '#334155', // slate-700 (Good for primary text)
          800: '#1e293b', // slate-800 (Darker elements)
          900: '#0f172a', // slate-900
          950: '#020617', // slate-950
        },
        background: '#f1f5f9',      // Same as neutral-100
        textPrimary: '#334155',     // Same as neutral-700
        textSecondary: '#64748b',   // Same as neutral-500

        success: '#10b981', // Tailwind emerald-500 (brighter green)
        error: '#ef4444',   // Tailwind red-500 (brighter red)
        warning: '#f59e0b', // Tailwind amber-500

        // Tier Colors
        'stone-grey': {
          light: '#f3f4f6',      // Tailwind gray-100 (for BG of Michelangelo card)
          DEFAULT: '#d1d5db',    // Tailwind gray-300 (for borders, subtle elements)
          dark: '#6b7280',        // Tailwind gray-500 (for text on light stone, or darker accents)
          content: '#1f2937',     // Tailwind gray-800 (for text on stone-grey-light)
        },
        'deep-blue': {
          light: '#3b82f6',      // Tailwind blue-500 (for accents or hover)
          DEFAULT: '#2563eb',    // Tailwind blue-600 (main color for Dante tier)
          dark: '#1d4ed8',        // Tailwind blue-700 (for darker accents or hover)
          content: '#ffffff',     // White text for deep blue backgrounds
        },
        'rich-gold': {
          light: '#fde68a',      // Tailwind amber-200 (for light gold backgrounds)
          DEFAULT: '#facc15',    // Tailwind yellow-400 (main color for da Vinci, a bit brighter gold)
          dark: '#eab308',        // Tailwind yellow-500 (for darker accents)
          content: '#422006',     // Dark brown for text on gold (better contrast than pure black)
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Source Sans Pro', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0, 0, 0, 0.08)',
        medium: '0 8px 20px rgba(0, 0, 0, 0.1)',
        hard: '0 12px 30px rgba(0, 0, 0, 0.12)',
        // Specific for tiers if needed
        'tier-michelangelo': '0 6px 15px rgba(156, 163, 175, 0.2)', // stone-grey-dark with alpha
        'tier-dante': '0 8px 20px rgba(37, 99, 235, 0.25)',      // deep-blue with alpha
        'tier-davinci': '0 10px 25px rgba(245, 158, 11, 0.3)',    // rich-gold with alpha
      },
      backgroundImage: {
        // You'd define actual image URLs or more complex gradients here
        'marble-texture-light': "linear-gradient(to bottom right, theme('colors.stone-grey.light / 0.05'), transparent), url('/textures/subtle-marble.png')",
        'parchment-texture-light': "linear-gradient(to bottom right, theme('colors.amber.50 / 0.1'), transparent), url('/textures/subtle-parchment.png')",
        'blueprint-texture-light': "linear-gradient(to bottom right, theme('colors.sky.100 / 0.05'), transparent), url('/textures/subtle-blueprint.png')",
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    typographyPlugin,
    function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.text-shadow-sm': {
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-md': {
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.15)',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
  keyframes: {
    shimmer: {
      '0%': { 'background-position': '-1000px 0' },
      '100%': { 'background-position': '1000px 0' },
    },
    fadeIn: { // Added for modal
      '0%': { opacity: '0', transform: 'scale(0.95)' },
      '100%': { opacity: '1', transform: 'scale(1)' },
    },
    fadeInUp: {
      '0%': { opacity: 0, transform: 'translateY(10px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
  },
  animation: {
    shimmer: 'shimmer 2s infinite linear',
    fadeIn: 'fadeIn 0.3s ease-out forwards', // Added for modal
    'spin-slow': 'spin 4s linear infinite',
    'fadeInUp': 'fadeInUp 0.5s ease-out',
  },
} satisfies Config

export default config