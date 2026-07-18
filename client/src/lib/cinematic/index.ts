export {
  generateCinematicTheme,
  getDefaultCinematicTheme
} from "./ambientGenerator"

export {
  clearThemeCache,
  getCacheSize,
  getThemeFromCache,
  hasThemeInCache,
  removeThemeFromCache,
  saveThemeToCache
} from "./cache"

export {
  CINEMATIC_LIMITS,
  DEFAULT_THEME
} from "./constants"

export {
  extractPalette
} from "./colorExtractor"

export {
  normalizePalette
} from "./paletteNormalizer"

export {
  applyThemeVariables,
  createThemeVariables,
  removeThemeVariables
} from "./themeVariables"

export {
  useCinematicTheme
} from "./useCinematicTheme"

export {
  clamp,
  darken,
  hexToRgb,
  hexToRgba,
  lighten,
  mixColors,
  rgbToHex
} from "./utils"

export type {
  CinematicGradient,
  CinematicMotion,
  CinematicPalette,
  CinematicTheme,
  ExtractedPalette
} from "./types"

export type {
  CinematicCssVariables
} from "./themeVariables"

export type {
  UseCinematicThemeResult
} from "./useCinematicTheme"