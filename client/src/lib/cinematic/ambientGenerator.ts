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
    0.18
  )

  const middleBackground = mixColors(
    palette.background,
    palette.primary,
    0.34
  )

  const primaryAtmosphere = hexToRgba(
    palette.primary,
    0.42
  )

  const secondaryAtmosphere = hexToRgba(
    palette.secondary,
    0.28
  )

  const accentAtmosphere = hexToRgba(
    palette.accent,
    0.14
  )

  const spotlightGlow = hexToRgba(
    palette.primary,
    0.34
  )

  const spotlightSecondary = hexToRgba(
    palette.secondary,
    0.18
  )

  return {
    palette,

    gradients: {
      background: [
        `radial-gradient(circle at 16% 18%, ${primaryAtmosphere} 0%, transparent 34%)`,
        `radial-gradient(circle at 84% 12%, ${secondaryAtmosphere} 0%, transparent 30%)`,
        `radial-gradient(circle at 52% 88%, ${accentAtmosphere} 0%, transparent 38%)`,
        `linear-gradient(135deg, ${deepBackground} 0%, ${middleBackground} 48%, ${palette.background} 100%)`
      ].join(", "),

      spotlight: [
        "radial-gradient(",
        "ellipse at 50% 34%,",
        `${spotlightGlow} 0%,`,
        `${spotlightSecondary} 34%,`,
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
