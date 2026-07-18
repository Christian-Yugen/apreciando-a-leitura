import { DEFAULT_THEME } from "./constants"
import type {
  CinematicPalette,
  CinematicTheme
} from "./types"
import {
  darken,
  hexToRgba,
  mixColors
} from "./utils"

/**
 * Gera um tema cinematográfico completo
 * a partir de uma paleta já normalizada.
 */
export function generateCinematicTheme(
  palette: CinematicPalette
): CinematicTheme {
  const deepBackground = darken(
    palette.background,
    0.32
  )

  const middleBackground = mixColors(
    palette.background,
    palette.primary,
    0.12
  )

  const subtleGlow = hexToRgba(
    palette.primary,
    0.18
  )

  const secondaryGlow = hexToRgba(
    palette.secondary,
    0.1
  )

  return {
    palette,

    gradients: {
      background: [
        "linear-gradient(",
        "180deg,",
        `${deepBackground} 0%,`,
        `${middleBackground} 48%,`,
        `${palette.background} 100%`,
        ")"
      ].join(" "),

      spotlight: [
        "radial-gradient(",
        "ellipse at 50% 32%,",
        `${subtleGlow} 0%,`,
        `${secondaryGlow} 32%,`,
        "transparent 72%",
        ")"
      ].join(" ")
    },

    motion: {
      duration: DEFAULT_THEME.motion.duration,
      easing: DEFAULT_THEME.motion.easing
    }
  }
}

/**
 * Retorna o tema padrão quando não existe
 * uma imagem ativa ou quando ocorre alguma falha.
 */
export function getDefaultCinematicTheme(): CinematicTheme {
  return DEFAULT_THEME
}