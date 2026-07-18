import { CINEMATIC_LIMITS, DEFAULT_THEME } from "./constants"
import type { CinematicPalette, ExtractedPalette } from "./types"
import {
  clamp,
  darken,
  hexToRgb,
  hexToRgba,
  mixColors,
  rgbToHex
} from "./utils"

interface HslColor {
  h: number
  s: number
  l: number
}

/**
 * Converte RGB para HSL.
 */
function rgbToHsl(
  red: number,
  green: number,
  blue: number
): HslColor {
  const r = red / 255
  const g = green / 255
  const b = blue / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  let hue = 0
  let saturation = 0

  const lightness = (max + min) / 2
  const difference = max - min

  if (difference !== 0) {
    saturation =
      lightness > 0.5
        ? difference / (2 - max - min)
        : difference / (max + min)

    switch (max) {
      case r:
        hue = (g - b) / difference + (g < b ? 6 : 0)
        break

      case g:
        hue = (b - r) / difference + 2
        break

      default:
        hue = (r - g) / difference + 4
        break
    }

    hue /= 6
  }

  return {
    h: hue * 360,
    s: saturation * 100,
    l: lightness * 100
  }
}

/**
 * Converte HSL para RGB.
 */
function hslToRgb(
  hue: number,
  saturation: number,
  lightness: number
): string {
  const h = ((hue % 360) + 360) % 360 / 360
  const s = clamp(saturation, 0, 100) / 100
  const l = clamp(lightness, 0, 100) / 100

  if (s === 0) {
    const gray = l * 255

    return rgbToHex(gray, gray, gray)
  }

  const hueToRgb = (
    p: number,
    q: number,
    value: number
  ): number => {
    let t = value

    if (t < 0) t += 1
    if (t > 1) t -= 1

    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6

    return p
  }

  const q =
    l < 0.5
      ? l * (1 + s)
      : l + s - l * s

  const p = 2 * l - q

  return rgbToHex(
    hueToRgb(p, q, h + 1 / 3) * 255,
    hueToRgb(p, q, h) * 255,
    hueToRgb(p, q, h - 1 / 3) * 255
  )
}

/**
 * Limita brilho e saturação para preservar a linguagem cinematográfica.
 */
function normalizeColor(color: string): string {
  const rgb = hexToRgb(color)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  const normalizedSaturation = clamp(
    hsl.s,
    CINEMATIC_LIMITS.MIN_SATURATION,
    CINEMATIC_LIMITS.MAX_SATURATION
  )

  const normalizedLightness = clamp(
    hsl.l,
    CINEMATIC_LIMITS.MIN_LIGHTNESS,
    CINEMATIC_LIMITS.MAX_LIGHTNESS
  )

  return hslToRgb(
    hsl.h,
    normalizedSaturation,
    normalizedLightness
  )
}

/**
 * Escolhe a melhor cor disponível na paleta extraída.
 */
function selectPrimaryColor(
  palette: ExtractedPalette
): string {
  return (
    palette.darkVibrant ??
    palette.vibrant ??
    palette.darkMuted ??
    palette.muted ??
    palette.dominant
  )
}

/**
 * Converte a paleta bruta da capa em uma paleta segura para a interface.
 */
export function normalizePalette(
  extracted: ExtractedPalette
): CinematicPalette {
  const rawPrimary = selectPrimaryColor(extracted)
  const primary = normalizeColor(rawPrimary)

  const secondarySource =
    extracted.darkMuted ??
    extracted.muted ??
    extracted.darkVibrant ??
    extracted.dominant

  const secondary = darken(
    normalizeColor(secondarySource),
    0.18
  )

  const accent = mixColors(
    primary,
    DEFAULT_THEME.palette.accent,
    0.36
  )

  const background = mixColors(
    "#080808",
    primary,
    0.14
  )

  return {
    primary,
    secondary,
    accent,
    background,

    overlay: `rgba(5, 5, 5, ${CINEMATIC_LIMITS.OVERLAY_OPACITY})`,

    glow: hexToRgba(
      primary,
      CINEMATIC_LIMITS.GLOW_OPACITY
    ),

    shadow: "rgba(0, 0, 0, 0.68)",

    text: DEFAULT_THEME.palette.text
  }
}