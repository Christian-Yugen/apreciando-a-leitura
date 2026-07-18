import type { CSSProperties } from "react"

import type { CinematicTheme } from "./types"

/**
 * Variáveis CSS públicas do AL Cinematic Engine.
 *
 * Os componentes devem consumir essas variáveis em vez
 * de acessar diretamente as cores do tema.
 */
export interface CinematicCssVariables extends CSSProperties {
  "--al-cinematic-primary": string
  "--al-cinematic-secondary": string
  "--al-cinematic-accent": string
  "--al-cinematic-background": string
  "--al-cinematic-overlay": string
  "--al-cinematic-glow": string
  "--al-cinematic-shadow": string
  "--al-cinematic-text": string
  "--al-cinematic-gradient-background": string
  "--al-cinematic-gradient-spotlight": string
  "--al-cinematic-duration": string
  "--al-cinematic-easing": string
}

/**
 * Converte o tema cinematográfico em variáveis CSS.
 *
 * Uso futuro:
 *
 * <section style={createThemeVariables(theme)}>
 */
export function createThemeVariables(
  theme: CinematicTheme
): CinematicCssVariables {
  return {
    "--al-cinematic-primary": theme.palette.primary,
    "--al-cinematic-secondary": theme.palette.secondary,
    "--al-cinematic-accent": theme.palette.accent,
    "--al-cinematic-background": theme.palette.background,
    "--al-cinematic-overlay": theme.palette.overlay,
    "--al-cinematic-glow": theme.palette.glow,
    "--al-cinematic-shadow": theme.palette.shadow,
    "--al-cinematic-text": theme.palette.text,
    "--al-cinematic-gradient-background":
      theme.gradients.background,
    "--al-cinematic-gradient-spotlight":
      theme.gradients.spotlight,
    "--al-cinematic-duration":
      `${theme.motion.duration}ms`,
    "--al-cinematic-easing":
      theme.motion.easing
  }
}

/**
 * Aplica as variáveis diretamente a um elemento HTML.
 *
 * Útil quando o tema precisar controlar uma região
 * existente sem alterar a estrutura do JSX.
 */
export function applyThemeVariables(
  element: HTMLElement,
  theme: CinematicTheme
): void {
  const variables = createThemeVariables(theme)

  Object.entries(variables).forEach(([property, value]) => {
    if (typeof value === "string") {
      element.style.setProperty(property, value)
    }
  })
}

/**
 * Remove todas as variáveis cinematográficas
 * previamente aplicadas ao elemento.
 */
export function removeThemeVariables(
  element: HTMLElement
): void {
  const properties: Array<keyof CinematicCssVariables> = [
    "--al-cinematic-primary",
    "--al-cinematic-secondary",
    "--al-cinematic-accent",
    "--al-cinematic-background",
    "--al-cinematic-overlay",
    "--al-cinematic-glow",
    "--al-cinematic-shadow",
    "--al-cinematic-text",
    "--al-cinematic-gradient-background",
    "--al-cinematic-gradient-spotlight",
    "--al-cinematic-duration",
    "--al-cinematic-easing"
  ]

  properties.forEach(property => {
    element.style.removeProperty(property)
  })
}