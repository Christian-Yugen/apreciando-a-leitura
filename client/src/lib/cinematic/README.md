# AL Cinematic Engine

Motor visual do projeto **Apreciando a Leitura** responsável por gerar atmosferas cinematográficas a partir das capas dos livros.

O motor extrai as principais cores de uma imagem, normaliza a paleta para preservar legibilidade e identidade visual, gera gradientes e disponibiliza o resultado como um tema reutilizável.

---

## Fluxo de processamento

```text
Imagem da capa
    ↓
colorExtractor.ts
    ↓
ExtractedPalette
    ↓
paletteNormalizer.ts
    ↓
CinematicPalette
    ↓
ambientGenerator.ts
    ↓
CinematicTheme
    ↓
themeVariables.ts
    ↓
Variáveis CSS