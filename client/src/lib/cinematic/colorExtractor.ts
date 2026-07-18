import Vibrant from "node-vibrant"

import type { ExtractedPalette } from "./types"

/**
 * Extrai automaticamente as principais cores de uma imagem.
 */
export async function extractPalette(
  image: string
): Promise<ExtractedPalette> {

  const palette = await Vibrant.from(image).getPalette()

  return {
    dominant:
      palette.Vibrant?.hex ??
      palette.DarkVibrant?.hex ??
      palette.Muted?.hex ??
      "#C8A96A",

    vibrant:
      palette.Vibrant?.hex,

    muted:
      palette.Muted?.hex,

    darkVibrant:
      palette.DarkVibrant?.hex,

    darkMuted:
      palette.DarkMuted?.hex,

    lightVibrant:
      palette.LightVibrant?.hex,

    lightMuted:
      palette.LightMuted?.hex
  }
}
