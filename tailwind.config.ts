import type { Config } from 'tailwindcss'

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
      padding: '1rem'
    },
    screens: {
      sm: '660px',
      md: '760px',
      lg: '960px',
      xl: '1200px'
    },
    extend: {
      colors: {
        primary: '#003366',
        secondary: '#B0B0B0',
        background: '#F5F5F5',
        textPrimary: '#1E293B',
        textSecondary: '#4B5563',
        accent: '#008080',
        accentHover: '#006666',
        white: '#FFFFFF',
        yellow: {
          DEFAULT: '#FFD700',
          hover: '#FFC700'
        }
      },
      fontFamily: {
        heading: ['Merriweather', 'serif'],
        body: ['Open Sans', 'sans-serif']
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config

export default config
