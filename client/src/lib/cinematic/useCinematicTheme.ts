import { useEffect, useState } from "react"

import { generateCinematicTheme } from "./ambientGenerator"
import {
  getThemeFromCache,
  saveThemeToCache
} from "./cache"
import { DEFAULT_THEME } from "./constants"
import { extractPalette } from "./colorExtractor"
import { normalizePalette } from "./paletteNormalizer"
import type { CinematicTheme } from "./types"

export interface UseCinematicThemeResult {
  theme: CinematicTheme
  isLoading: boolean
  error: Error | null
}

/**
 * Gera automaticamente uma atmosfera cinematográfica
 * com base na imagem informada.
 *
 * O tema padrão é retornado quando:
 * - não existe imagem;
 * - a extração falha;
 * - o processamento ainda não terminou.
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

    // A partir daqui sabemos que existe uma URL válida.
    // Criamos uma constante tipada como string para evitar
    // problemas de narrowing dentro da função assíncrona.
    const image: string = normalizedUrl

    const cachedTheme = getThemeFromCache(image)

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
          generateCinematicTheme(normalizedPalette)

        saveThemeToCache(
          image,
          generatedTheme
        )

        if (!isCancelled) {
          setTheme(generatedTheme)
        }
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

        setError(processingError)
        setTheme(DEFAULT_THEME)
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