import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

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
      colors: {
        primary: '#00c1d8',
        secondary: '#0086ff',
        black: '#333333',
        'team-primary': 'var(--team-primary-color, #fff)',
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
        sans: [
          'canada-type-gibson',
          'canada-type-gibson-fallback',
          ...defaultTheme.fontFamily.sans,
        ],
        mono: ['"Courier New"', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
} satisfies Config
