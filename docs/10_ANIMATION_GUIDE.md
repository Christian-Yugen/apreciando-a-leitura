# APRECIANDO A LEITURA
# Animation Guide
Versão 2.0 — Movimento Cinematográfico

---

## 1. Princípio

O movimento deve orientar a atenção e reforçar profundidade.

Nunca deve competir com a leitura.

---

## 2. Durações

- microinteração: 120–180 ms;
- hover e foco: 180–240 ms;
- abertura de painel: 220–320 ms;
- transição editorial: 300–500 ms;
- movimento atmosférico: 12–20 s.

---

## 3. Curvas

Preferir:

- `ease-out` para entrada;
- `ease-in` para saída;
- `cubic-bezier(.23,1,.32,1)` para elevação e revelação.

---

## 4. Interações

Capas e imagens:

- escala máxima entre 1.02 e 1.045;
- deslocamento vertical máximo de 4 px;
- reforço discreto de borda ou sombra.

Botões:

- mudança de contraste;
- deslocamento máximo de 2 px;
- resposta imediata.

Links:

- linha dourada progressiva;
- mudança de cor sem salto de layout.

---

## 5. Revelação de conteúdo

Quando um painel ou resumo abrir:

- sinalizar no elemento acionado;
- revelar com fade e pequeno deslocamento;
- rolar apenas quando necessário;
- manter o foco lógico do teclado.

---

## 6. Movimento atmosférico

Permitido apenas em heróis e fundos decorativos.

Exemplos:

- zoom lento;
- variação suave de luz;
- grão estático;
- vinheta.

Nunca animar textos longos durante a leitura.

---

## 7. Acessibilidade

Com `prefers-reduced-motion: reduce`:

- remover animações não essenciais;
- reduzir transições a resposta imediata;
- desativar zoom contínuo;
- preservar feedback visual sem movimento.

---

## 8. Performance

Animar preferencialmente:

- `transform`;
- `opacity`.

Evitar animações frequentes em:

- altura;
- largura;
- sombras muito grandes;
- filtros complexos.

---

## 9. Regra final

Se uma animação não melhora orientação, feedback ou atmosfera, ela não deve existir.
