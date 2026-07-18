import type { CinematicTheme } from "./types"

/**
 * Tema padrão do Apreciando a Leitura.
 *
 * Este tema é utilizado enquanto nenhum livro está ativo.
 * Quando uma capa é selecionada, o Cinematic Engine gera um novo
 * tema automaticamente mantendo esta identidade visual.
 */
export const DEFAULT_THEME: CinematicTheme = {
  palette: {
    primary: "#C8A96A",
    secondary: "#8A6B3F",
    accent: "#E7D5A5",

    background: "#090909",
    overlay: "rgba(9,9,9,.78)",

    glow: "rgba(200,169,106,.18)",
    shadow: "rgba(0,0,0,.62)",

    text: "#F4F1E8"
  },

  gradients: {
    background:
      "linear-gradient(180deg,#090909 0%,#111111 45%,#181818 100%)",

    spotlight:
      "radial-gradient(circle at center, rgba(200,169,106,.10), transparent 72%)"
  },

  motion: {
    duration: 450,
    easing: "cubic-bezier(.22,.61,.36,1)"
  }
}

/**
 * Limites utilizados pelo normalizador.
 * Eles garantem que nenhuma capa gere uma interface
 * exageradamente saturada ou muito clara.
 */
export const CINEMATIC_LIMITS = {
  MIN_LIGHTNESS: 18,
  MAX_LIGHTNESS: 42,

  MIN_SATURATION: 18,
  MAX_SATURATION: 55,

  GLOW_OPACITY: 0.18,

  OVERLAY_OPACITY: 0.78
} as const
