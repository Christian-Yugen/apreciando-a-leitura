import { Vibrant } from "node-vibrant/browser"

import type { ExtractedPalette } from "./types"

export function getCinematicImageUrl(
  imageUrl: string
): string {
  const trimmedUrl = imageUrl.trim()

  if (trimmedUrl.startsWith("/")) {
    return trimmedUrl
  }

  if (
    typeof window !== "undefined" &&
    trimmedUrl.startsWith(window.location.origin)
  ) {
    return trimmedUrl
  }

  return `/api/image-proxy?url=${encodeURIComponent(
    trimmedUrl
  )}`
}

/**
 * Extrai automaticamente as principais cores de uma imagem
 * utilizando a implementação do node-vibrant para navegadores.
 */
export async function extractPalette(
  image: string
): Promise<ExtractedPalette> {
  const sourceUrl = getCinematicImageUrl(image)
  const palette = await Vibrant.from(sourceUrl).getPalette()

  return {
    dominant:
      palette.Vibrant?.hex ??
      palette.DarkVibrant?.hex ??
      palette.Muted?.hex ??
      "#C8A96A",

    vibrant: palette.Vibrant?.hex,

    muted: palette.Muted?.hex,

    darkVibrant: palette.DarkVibrant?.hex,

    darkMuted: palette.DarkMuted?.hex,

    lightVibrant: palette.LightVibrant?.hex,

    lightMuted: palette.LightMuted?.hex
  }
}
