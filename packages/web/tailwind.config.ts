import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import containerQueries from '@tailwindcss/container-queries'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'selector',
  theme: {
    screens: {
      sm: '480px',
      md: '735px',
      lg: '980px',
      xl: '1280px',
    },
    extend: {
      fontSize: {
        sm: '0.77rem',
        base: '1rem',
        xl: '1.23rem',
        '2xl': '2rem',
      },
      colors: {
        primary: '#00c1d8',
        secondary: '#0086ff',
        black: '#333333',
        'team-primary': 'var(--team-primary-color, #fff)',
        'team-primary-bg': 'var(--team-primary-color, #f7f7f7)',
        'team-primary-dark-bg': 'var(--team-primary-color, #151516)',
        'team-primary-panel-bg': 'var(--team-primary-color, #ffffff)',
        'team-primary-panel-dark-bg': 'var(--team-primary-color, #202124)',
        'team-secondary': 'var(--team-secondary-color, #333)',
        'team-secondary-dark': 'var(--team-secondary-color, #fff)',
        'team-secondary-sm-default': 'var(--team-secondary-color, #00c1d8)',
        gray: {
          1: '#333333',
          2: '#151516',
          3: '#202124',
          4: '#303134',
          5: '#909396',
          6: '#ebebeb',
          7: '#f7f7f7',
          8: '#ffffff',
        },
        teal: '#00c1d8',
        green: '#32c771',
        orange: '#efa125',
        red: '#dd3636',
      },
      fontFamily: {
        sans: ['calibre', 'calibre-fallback', ...defaultTheme.fontFamily.sans],
        mono: ['"Courier New"', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [containerQueries],
} satisfies Config
