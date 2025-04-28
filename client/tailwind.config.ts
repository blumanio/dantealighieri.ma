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
          DEFAULT: '#0d9488', // Your main teal
          light: '#14b8a6',   // Lighter teal
          dark: '#0f766e',    // Darker teal
        },
        secondary: {
          DEFAULT: '#0d7994', // Blue-teal
          light: '#0d9456',   // Green-teal
          dark: '#075985',    // Darker blue-teal
        },
        accent: {
          DEFAULT: '#940d15', // Complementary red
          light: '#b91c1c',   // Lighter red
          dark: '#7f1d1d',    // Darker red
        },
        neutral: {
          50: '#f1f5f9',      // Lightest gray
          100: '#e2e8f0',
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',     // Dark slate
          700: '#1e293b',
          800: '#0f172a',
          900: '#020617',
        },
        background: '#f1f5f9',
        textPrimary: '#334155',
        textSecondary: '#475569',
        success: '#0d9456',
        error: '#940d15',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Source Sans Pro', 'sans-serif'],
      },
      // Rest of your existing configuration...
    },
  },
  plugins: [require('tailwindcss-animate'), typographyPlugin,],
  keyframes: {
    shimmer: {
      '0%': {
        'background-position': '-1000px 0',
      },
      '100%': {
        'background-position': '1000px 0',
      },
    },
  },
  animation: {
    shimmer: 'shimmer 2s infinite linear',
  },
} satisfies Config

export default config