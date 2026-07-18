import type { CinematicTheme } from "./types"

/**
 * Cache interno do AL Cinematic Engine.
 *
 * A chave normalmente será a URL da capa do livro.
 */
const themeCache = new Map<string, CinematicTheme>()

/**
 * Obtém um tema previamente processado.
 */
export function getThemeFromCache(
  key: string
): CinematicTheme | undefined {
  return themeCache.get(key)
}

/**
 * Salva um tema no cache.
 */
export function saveThemeToCache(
  key: string,
  theme: CinematicTheme
): void {
  themeCache.set(key, theme)
}

/**
 * Verifica se o tema já existe.
 */
export function hasThemeInCache(
  key: string
): boolean {
  return themeCache.has(key)
}

/**
 * Remove um tema específico.
 */
export function removeThemeFromCache(
  key: string
): void {
  themeCache.delete(key)
}

/**
 * Limpa todo o cache.
 */
export function clearThemeCache(): void {
  themeCache.clear()
}

/**
 * Quantidade de temas atualmente armazenados.
 */
export function getCacheSize(): number {
  return themeCache.size
}