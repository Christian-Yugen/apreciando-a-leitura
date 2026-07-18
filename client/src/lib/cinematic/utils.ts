/**
 * AL Cinematic Engine
 * ----------------------------------------------------------
 * Utilidades de manipulação de cores.
 */

/**
 * Garante que um valor permaneça entre min e max.
 */
export function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Converte HEX para RGB.
 */
export function hexToRgb(hex: string) {
  const value = hex.replace("#", "")

  const bigint = Number.parseInt(value, 16)

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}

/**
 * Converte RGB para HEX.
 */
export function rgbToHex(
  r: number,
  g: number,
  b: number
): string {
  return (
    "#" +
    [r, g, b]
      .map(v => {
        const hex = clamp(Math.round(v), 0, 255).toString(16)
        return hex.length === 1 ? "0" + hex : hex
      })
      .join("")
  )
}

/**
 * Mistura duas cores.
 *
 * amount = 0 → colorA
 * amount = 1 → colorB
 */
export function mixColors(
  colorA: string,
  colorB: string,
  amount: number
): string {

  const a = hexToRgb(colorA)
  const b = hexToRgb(colorB)

  const mix = clamp(amount, 0, 1)

  return rgbToHex(
    a.r + (b.r - a.r) * mix,
    a.g + (b.g - a.g) * mix,
    a.b + (b.b - a.b) * mix
  )
}

/**
 * Escurece uma cor.
 */
export function darken(
  color: string,
  amount: number
): string {

  return mixColors(color, "#000000", amount)
}

/**
 * Clareia uma cor.
 */
export function lighten(
  color: string,
  amount: number
): string {

  return mixColors(color, "#FFFFFF", amount)
}

/**
 * Converte HEX para rgba().
 */
export function hexToRgba(
  color: string,
  alpha: number
): string {

  const rgb = hexToRgb(color)

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clamp(alpha,0,1)})`
}
