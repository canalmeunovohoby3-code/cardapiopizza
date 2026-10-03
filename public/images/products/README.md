# Imagens dos produtos

Enquanto o cliente não enviar as fotos reais, o cardápio usa **arte ilustrada
de identidade consistente** (mesmo fundo, ângulo, luz e enquadramento) — veja
`src/components/art/`. A arte **não** é uma foto e não tenta se passar por uma.

## Estrutura

```
image-sources/                 <- ORIGINAIS (não vão para o site)
├── pizzas/                    -> calabresa.png, costela.jpg, ...
└── drinks/                    -> coca-cola-2l.jpg, ...

public/images/products/        <- GERADOS pelo pipeline (WebP com hash)
├── pizzas/                    -> pizza-<id>-<hash>.webp
├── drinks/                    -> drink-<id>-<hash>.webp
└── edges/
```

## Como ativar uma foto (automático)

1. Coloque a original em `image-sources/pizzas/` (ou `drinks/`) com o
   **id do produto** como nome do arquivo:

   | Origem | Produto |
   | --- | --- |
   | `calabresa.png` | Calabresa |
   | `frango-catupiry.jpg` | Frango com Catupiry |
   | `portuguesa.jpg` | Portuguesa |
   | `quatro-queijos.jpg` | Quatro Queijos |
   | `lombo-catupiry.jpg` | Lombo com Catupiry |
   | `cheddar-bacon.jpg` | Cheddar e Bacon |
   | `mussarela.jpg` | Mussarela |
   | `tradicional.jpg` | Tradicional |
   | `costela.jpg` | Costela |
   | `chocolate.jpg` | Chocolate |
   | `prestigio.jpg` | Prestígio |
   | `dois-amores.jpg` | Dois Amores |

2. Rode `npm run optimize:images`.

A foto é padronizada em **quadrado 1:1** (recorte por atenção, mantendo o
produto central), exportada em **WebP com hash no nome** e ligada ao sabor
**pelo id** (via `src/data/generated-images.ts`) — sem editar o `menu.ts`. Assim
**todos os cards ficam do mesmo tamanho**. O hash muda quando a foto muda, então
o cliente nunca vê versão antiga em cache.

Enquanto não houver foto, a arte ilustrada é exibida (fallback intencional).

## Direção fotográfica (obrigatória para manter a consistência)

Todas as fotos devem parecer do **mesmo ensaio**:

- pizza inteira, redonda, vista de cima com leve inclinação (~20–45°);
- mesma distância da câmera (o pipeline padroniza o card em 1:1);
- fundo neutro escuro e elegante, igual em todas;
- iluminação de estúdio suave, mesma direção de luz;
- cores naturais, aparência realista e apetitosa, foco no produto;
- ingredientes características do sabor bem visíveis;
- **sem** texto, marca d'água, logotipo de terceiros, pessoas ou ambientes diferentes;
- não misturar foto profissional com foto ruim.

Sugestão de prompt (para geração de imagem):

> "Fotografia gastronômica profissional de uma pizza brasileira, pizza inteira
> redonda vista em ângulo de aproximadamente 45 graus, massa dourada, queijo
> derretido, iluminação de estúdio suave, fundo neutro escuro e elegante,
> composição centralizada, aparência realista e apetitosa, fotografia comercial
> de cardápio, alta definição." — depois alterar apenas o sabor/ingredientes.

## Performance

As fotos são servidas por `next/image`, que já entrega **AVIF/WebP**, aplica
**lazy loading** (exceto a primeira tela) e reserva a dimensão para não haver
_layout shift_. Ainda assim, exporte as imagens com no máximo ~1200px no maior
lado e peso ideal abaixo de ~200 KB.

## Origem das imagens

Registre a procedência e a licença de toda imagem externa em `CREDITS.md`.
Não use imagens de marca d'água, de concorrentes ou sem licença comercial.
