/** @type {import('tailwindcss').Config} */

const tokenScale = (name) => ({
  50:  `rgb(var(--color-${name}-50)  / <alpha-value>)`,
  100: `rgb(var(--color-${name}-100) / <alpha-value>)`,
  200: `rgb(var(--color-${name}-200) / <alpha-value>)`,
  300: `rgb(var(--color-${name}-300) / <alpha-value>)`,
  400: `rgb(var(--color-${name}-400) / <alpha-value>)`,
  500: `rgb(var(--color-${name}-500) / <alpha-value>)`,
  600: `rgb(var(--color-${name}-600) / <alpha-value>)`,
  700: `rgb(var(--color-${name}-700) / <alpha-value>)`,
  800: `rgb(var(--color-${name}-800) / <alpha-value>)`,
  900: `rgb(var(--color-${name}-900) / <alpha-value>)`,
  950: `rgb(var(--color-${name}-950) / <alpha-value>)`,
  DEFAULT: `rgb(var(--color-${name}-600) / <alpha-value>)`,
});

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: tokenScale('primary'),
        accent:  tokenScale('accent'),
        brand: {
          50:  'rgb(var(--color-brand-50)  / <alpha-value>)',
          100: 'rgb(var(--color-brand-100) / <alpha-value>)',
          300: 'rgb(var(--color-brand-300) / <alpha-value>)',
          500: 'rgb(var(--color-brand-500) / <alpha-value>)',
          600: 'rgb(var(--color-brand-600) / <alpha-value>)',
          700: 'rgb(var(--color-brand-700) / <alpha-value>)',
          800: 'rgb(var(--color-brand-800) / <alpha-value>)',
          900: 'rgb(var(--color-brand-900) / <alpha-value>)',
          950: 'rgb(var(--color-brand-950) / <alpha-value>)',
        },
        surface: {
          0:   'rgb(var(--color-surface-0)   / <alpha-value>)',
          ...tokenScale('surface'),
        },
        muted:  'rgb(var(--color-surface-500) / <alpha-value>)',
        ink:    'rgb(var(--color-surface-900) / <alpha-value>)',
        border: 'rgb(var(--color-surface-200) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Noto Sans', 'Noto Sans Devanagari', 'sans-serif'],
        display: ['"Noto Sans"', 'Noto Sans Devanagari', 'sans-serif'],
      },
      fontSize: {
        'display-md': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-lg': ['3.5rem', { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '800' }],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 4px 16px -2px rgba(0,0,0,0.10), 0 2px 6px -1px rgba(0,0,0,0.06)',
        button: '0 6px 16px -4px rgba(5,150,105,0.45)',
        glass: '0 8px 32px rgba(0,0,0,0.18)',
        'glow-primary': '0 0 0 6px rgba(5,150,105,0.15)',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
