import { useEffect, useState } from "react"

import { generateCinematicTheme } from "./ambientGenerator"
import {
  getThemeFromCache,
  saveThemeToCache
} from "./cache"
import { DEFAULT_THEME } from "./constants"
import { extractPalette } from "./colorExtractor"
import { normalizePalette } from "./paletteNormalizer"
import type {
  CinematicTheme,
  ExtractedPalette
} from "./types"

export interface UseCinematicThemeResult {
  theme: CinematicTheme
  isLoading: boolean
  error: Error | null
}

const REAL_THEME_CACHE_VERSION = "v2:real:"

const FALLBACK_COLORS = [
  "#8f3f35",
  "#355f72",
  "#5e4b78",
  "#3e6651",
  "#8a623d",
  "#6e3f58",
  "#315e66",
  "#75612f"
] as const

/**
 * Cria uma paleta estável baseada na URL da capa.
 *
 * Essa paleta é usada quando o navegador não consegue
 * acessar os pixels da imagem por restrições de CORS.
 */
function createUrlFallbackPalette(
  imageUrl: string
): ExtractedPalette {
  let hash = 0

  for (
    let index = 0;
    index < imageUrl.length;
    index += 1
  ) {
    hash =
      (hash * 31 + imageUrl.charCodeAt(index)) >>> 0
  }

  const primary =
    FALLBACK_COLORS[
      hash % FALLBACK_COLORS.length
    ]

  const secondary =
    FALLBACK_COLORS[
      Math.floor(
        hash / FALLBACK_COLORS.length
      ) % FALLBACK_COLORS.length
    ]

  return {
    dominant: primary,
    vibrant: primary,
    muted: secondary,
    darkMuted: secondary
  }
}

/**
 * Gera automaticamente uma atmosfera cinematográfica
 * com base na imagem informada.
 */
export function useCinematicTheme(
  imageUrl?: string | null
): UseCinematicThemeResult {
  const [theme, setTheme] =
    useState<CinematicTheme>(DEFAULT_THEME)

  const [isLoading, setIsLoading] =
    useState(false)

  const [error, setError] =
    useState<Error | null>(null)

  useEffect(() => {
    let isCancelled = false

    const normalizedUrl = imageUrl?.trim()

    if (!normalizedUrl) {
      setTheme(DEFAULT_THEME)
      setIsLoading(false)
      setError(null)

      return () => {
        isCancelled = true
      }
    }

    const image = normalizedUrl
    const cacheKey = `${REAL_THEME_CACHE_VERSION}${image}`
    const cachedTheme = getThemeFromCache(cacheKey)

    if (cachedTheme) {
      setTheme(cachedTheme)
      setIsLoading(false)
      setError(null)

      return () => {
        isCancelled = true
      }
    }

    async function createTheme(): Promise<void> {
      setIsLoading(true)
      setError(null)

      try {
        const extractedPalette =
          await extractPalette(image)

        if (isCancelled) {
          return
        }

        const normalizedPalette =
          normalizePalette(extractedPalette)

        const generatedTheme =
          generateCinematicTheme(
            normalizedPalette
          )

        saveThemeToCache(
          cacheKey,
          generatedTheme
        )

        if (import.meta.env.DEV) {
          console.info(
            "[AL Cinematic Engine] Paleta real extraída via proxy:",
            image
          )
        }

        setTheme(generatedTheme)
      } catch (unknownError) {
        if (isCancelled) {
          return
        }

        const processingError =
          unknownError instanceof Error
            ? unknownError
            : new Error(
                "Não foi possível gerar a atmosfera cinematográfica."
              )

        try {
          const fallbackPalette =
            normalizePalette(
              createUrlFallbackPalette(image)
            )

          const fallbackTheme =
            generateCinematicTheme(
              fallbackPalette
            )

          if (import.meta.env.DEV) {
            console.warn(
              "[AL Cinematic Engine] Proxy falhou; fallback por URL aplicado:",
              image,
              processingError
            )
          }

          setError(processingError)
          setTheme(fallbackTheme)
        } catch (fallbackError) {
          if (import.meta.env.DEV) {
            console.error(
              "[AL Cinematic Engine] Proxy e fallback falharam; tema padrão aplicado:",
              image,
              fallbackError
            )
          }

          setError(processingError)
          setTheme(DEFAULT_THEME)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void createTheme()

    return () => {
      isCancelled = true
    }
  }, [imageUrl])

  return {
    theme,
    isLoading,
    error
  }
}
