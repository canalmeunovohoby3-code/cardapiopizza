# Créditos e licenças das imagens

Registre aqui a origem de **toda** imagem usada no cardápio (regra 27).
Prioridade: 1) fotos do cliente, 2) banco com licença comercial, 3) imagem
gerada para o projeto. Nunca use imagem sem licença ou de concorrentes.

## Pizzas

| Produto | Foto de origem (não publicada) | Arquivo servido (gerado) | Licença | Autor / Fonte |
| --- | --- | --- | --- | --- |
| Calabresa | `image-sources/pizzas/calabresa.png` | `images/products/pizzas/pizza-calabresa-<hash>.webp` | Confirmar com o cliente | Cliente |
| Frango com Catupiry | `image-sources/pizzas/frango-catupiry.jpg` | `images/products/pizzas/pizza-frango-catupiry-<hash>.webp` | Confirmar com o cliente | Cliente |
| Portuguesa | `image-sources/pizzas/portuguesa.png` | `images/products/pizzas/pizza-portuguesa-<hash>.webp` | Confirmar com o cliente | Cliente |
| Quatro Queijos | `image-sources/pizzas/quatro-queijos.jpg` | `images/products/pizzas/pizza-quatro-queijos-<hash>.webp` | Confirmar com o cliente | Cliente |
| Lombo com Catupiry | `image-sources/pizzas/lombo-catupiry.jpg` | `images/products/pizzas/pizza-lombo-catupiry-<hash>.webp` | Confirmar com o cliente | Cliente |
| Cheddar e Bacon | `image-sources/pizzas/cheddar-bacon.jpg` | `images/products/pizzas/pizza-cheddar-bacon-<hash>.webp` | Confirmar com o cliente | Cliente |
| Mussarela | `image-sources/pizzas/mussarela.jpg` | `images/products/pizzas/pizza-mussarela-<hash>.webp` | Confirmar com o cliente | Cliente |
| Tradicional | `image-sources/pizzas/tradicional.jpeg` | `images/products/pizzas/pizza-tradicional-<hash>.webp` | Confirmar com o cliente | Cliente |
| Costela | `image-sources/pizzas/costela.jpeg` | `images/products/pizzas/pizza-costela-<hash>.webp` | Confirmar com o cliente | Cliente |
| Chocolate | `image-sources/pizzas/chocolate.jpg` | `images/products/pizzas/pizza-chocolate-<hash>.webp` | Confirmar com o cliente | Cliente |
| Prestígio | `image-sources/pizzas/prestigio.jpg` | `images/products/pizzas/pizza-prestigio-<hash>.webp` | Confirmar com o cliente | Cliente |
| _Dois Amores_ | _(pendente de envio)_ | — | — | — |

## Bebidas

| Produto | Foto de origem (não publicada) | Arquivo servido (gerado) | Licença | Autor / Fonte |
| --- | --- | --- | --- | --- |
| _(pendente de envio)_ | `image-sources/drinks/...` | — | — | — |

> `<hash>` é um código de 8 caracteres gerado a partir do conteúdo da foto.
> Ele muda quando a foto muda, evitando que o navegador exiba uma versão antiga
> em cache. Os caminhos atuais estão em `src/data/generated-images.ts`.

> Os sabores ainda sem foto usam a arte ilustrada criada para este cardápio
> (`src/components/art/`), sem imagens de terceiros.

## Tratamento das fotos

As originais ficam em `image-sources/` (fora de `public/`, não vão para o site).
O comando `npm run optimize:images`:

1. corrige a orientação (EXIF);
2. padroniza em **quadrado 1:1** com recorte por atenção (mantém o produto
   central) e limita o lado a 1200px, sem ampliar imagens pequenas;
3. exporta WebP com hash no nome em `public/images/products/…`;
4. atualiza o manifesto `src/data/generated-images.ts` (caminho + dimensões).

**Atenção à consistência:** as fotos enviadas têm fundos, iluminação e
proporções diferentes. O script padroniza formato, tamanho e enquadramento do
card, mas **não iguala a cor de fundo nem a luz**. Para um ensaio 100% uniforme,
o ideal é fotografar/gerar todas no mesmo fundo e iluminação.

## Onde cada foto é referenciada

O `src/data/menu.ts` liga a foto ao produto automaticamente pelo `id`
(via `generated-images.ts`). Não é preciso editar caminhos no menu.
