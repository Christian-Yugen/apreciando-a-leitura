/**
 * AL Cinematic Engine
 * ------------------------------------------------------------------
 * Tipagens centrais utilizadas pelo mecanismo de atmosfera do site.
 */

export interface CinematicPalette {
  /** Cor dominante normalizada */
  primary: string

  /** Cor secundária */
  secondary: string

  /** Cor de destaque */
  accent: string

  /** Cor principal do fundo */
  background: string

  /** Overlay aplicado sobre o background */
  overlay: string

  /** Luz emitida pelo livro */
  glow: string

  /** Cor das sombras */
  shadow: string

  /** Cor padrão dos textos */
  text: string
}

export interface CinematicGradient {
  background: string
  spotlight: string
}

export interface CinematicMotion {
  duration: number
  easing: string
}

export interface CinematicTheme {
  palette: CinematicPalette

  gradients: CinematicGradient

  motion: CinematicMotion
}

export interface ExtractedPalette {
  dominant: string

  vibrant?: string

  muted?: string

  darkVibrant?: string

  darkMuted?: string

  lightVibrant?: string

  lightMuted?: string
}