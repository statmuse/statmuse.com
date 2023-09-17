// @ts-check

module.exports = {
  astroAllowShorthand: true,
  htmlWhitespaceSensitivity: 'ignore',
  semi: false,
  singleQuote: true,
  plugins: [
    require.resolve('prettier-plugin-astro'),
    require.resolve('prettier-plugin-svelte'),
  ],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
    { files: '*.svelte', options: { parser: 'svelte' } },
  ],
}
