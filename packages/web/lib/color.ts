export const hexToHSL = (hex: string, darken?: number) => {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '')

  // Parse r, g, b values
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)

  // Convert r, g, b to a range of 0 to 1
  r /= 255
  g /= 255
  b /= 255

  // Find the maximum and minimum values of r, g, b
  let max = Math.max(r, g, b)
  let min = Math.min(r, g, b)

  // Calculate lightness
  let l = (max + min) / 2

  let h, s

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  // Convert to degrees, percent
  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  // darken by 20%
  if (darken) l -= l * darken

  return `hsl(${h} ${s}% ${l}%)`
}
