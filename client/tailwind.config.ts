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
          DEFAULT: '#006747', // Deep Italian Green
          light: '#00855c',
          dark: '#004d35',
          content: '#ffffff',
        },
        secondary: {
          DEFAULT: '#D4836A', // Warm Terracotta
          light: '#df9c88',
          dark: '#c46b50',
          content: '#ffffff',
        },
        accent: {
          DEFAULT: '#FFD700', // Gold
          light: '#ffdf33',
          dark: '#ccac00',
          content: '#333333',
        },
        neutral: {
          50: '#F9F7F4', // Off-white Background
          100: '#f2eee9',
          200: '#e5ddd3',
          300: '#d1c4b3',
          400: '#a3927d',
          500: '#736656',
          600: '#5c5245',
          700: '#333333', // Dark Gray Text
          800: '#262626',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
        background: '#F9F7F4',      // Off-white
        textPrimary: '#333333',     // Dark Gray
        textSecondary: '#5c5245',   // Muted brown-gray for contrast

        success: '#006747',
        error: '#b91c1c',
        warning: '#D4836A',

        // Tier Colors
        'stone-grey': {
          light: '#f2eee9',
          DEFAULT: '#d1c4b3',
          dark: '#736656',
          content: '#333333',
        },
        'deep-blue': {
          light: '#00855c',
          DEFAULT: '#006747',
          dark: '#004d35',
          content: '#ffffff',
        },
        'rich-gold': {
          light: '#ffdf33',
          DEFAULT: '#FFD700',
          dark: '#ccac00',
          content: '#333333',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Source Sans Pro', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0, 0, 0, 0.05)',
        medium: '0 8px 20px rgba(0, 0, 0, 0.08)',
        hard: '0 12px 30px rgba(0, 0, 0, 0.1)',
        'tier-michelangelo': '0 6px 15px rgba(115, 102, 86, 0.15)',
        'tier-dante': '0 8px 20px rgba(0, 103, 71, 0.2)',
        'tier-davinci': '0 10px 25px rgba(255, 215, 0, 0.25)',
      },
      backgroundImage: {
        'marble-texture-light': "linear-gradient(to bottom right, theme('colors.stone-grey.light / 0.05'), transparent), url('/textures/subtle-marble.png')",
        'parchment-texture-light': "linear-gradient(to bottom right, theme('colors.secondary.light / 0.05'), transparent), url('/textures/subtle-parchment.png')",
        'blueprint-texture-light': "linear-gradient(to bottom right, theme('colors.primary.light / 0.05'), transparent), url('/textures/subtle-blueprint.png')",
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    typographyPlugin,
    function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.text-shadow-sm': {
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.05)',
        },
        '.text-shadow-md': {
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
} satisfies Config

export default config