const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
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
        'team-primary': 'var(--team-primary-color, #fff)',
        'team-secondary': 'var(--team-secondary-color, #000)',
        'team-secondary-sm-default': 'var(--team-secondary-color, #00c1d8)',
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
}
