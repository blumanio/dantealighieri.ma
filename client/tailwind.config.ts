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
          DEFAULT: '#003366',
          light: '#004080',
          dark: '#002B4D',
        },
        secondary: '#B0B0B0',
        background: '#F5F5F5',
        textPrimary: '#1E293B',
        textSecondary: '#4B5563',
        accent: {
          DEFAULT: '#008080',
          light: '#009999',
          dark: '#006666',
        },
        white: '#FFFFFF',
        yellow: {
          DEFAULT: '#FFD700',
          hover: '#FFC700',
        },
        error: '#FF3B30',
        success: '#34C759',
      },
      fontFamily: {
        heading: ['Merriweather', 'serif'],
        body: ['Open Sans', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.15)',
        'hard': '0 8px 30px rgba(0, 0, 0, 0.2)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
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
    },
  },
  plugins: [require('tailwindcss-animate'),
    typographyPlugin,]
} satisfies Config

export default config 