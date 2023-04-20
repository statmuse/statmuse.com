// @ts-check

/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
module.exports = {
  astroAllowShorthand: true,
  htmlWhitespaceSensitivity: 'ignore',
  semi: false,
  singleQuote: true,
  plugins: [
    require.resolve('prettier-plugin-astro'),
    // require.resolve('@ianvs/prettier-plugin-sort-imports'),
  ],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
