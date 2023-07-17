export const rgbToHex = (rgba: {
  r: number
  g: number
  b: number
  a: number
}) =>
  "#" +
  [rgba.r, rgba.g, rgba.b]
    .map((x) => {
      const hex = x.toString(16)
      return hex.length === 1 ? "0" + hex : hex
    })
    .join("")
