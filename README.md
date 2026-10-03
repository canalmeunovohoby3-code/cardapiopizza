# Cardápio Digital — Pizzaria

Cardápio digital mobile-first com carrinho, montagem de pizza (sabores, tamanho e borda),
promoção automática de segunda/terça/quarta e fechamento do pedido pelo WhatsApp.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- Sem backend, sem banco de dados e sem login. Página 100% estática.

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

### Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Ambiente de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Sobe o build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | Checagem de tipos |
| `npm run check:logic` | Verifica preços, promoção e mensagem do WhatsApp |

## Configuração (o que alterar)

Quase tudo se edita em **dois lugares**, sem mexer nos componentes:

### `src/data/config.ts`
- Nome da pizzaria, frase de chamada e endereço
- Cidade de entrega e **taxa de entrega** (`delivery.fee`)
- **Número do WhatsApp** (`WHATSAPP_NUMBER`)

### `src/data/menu.ts`
- Tamanhos e preços (`pizzaSizes`)
- Bordas e preços (`edges`)
- Sabores salgados e doces
- Refrigerantes (2L e latas)

### `src/data/promotions.ts`
- Dias da promoção, tamanho participante, brinde e quantidade por pizza

### Pasta `src/lib/`
Regras de negócio puras: preços, promoção, formatação e mensagem do WhatsApp.

### Imagens dos produtos
Enquanto não há fotos reais, o cardápio usa uma **arte ilustrada de identidade
consistente** (mesmo fundo, ângulo, luz e enquadramento) em
`src/components/art/` — uma ilustração, que **não** se passa por fotografia.

**Pipeline das fotos (automático):**

1. Coloque a original em `image-sources/pizzas/` com o nome do produto
   (ex.: `costela.jpg`, `dois-amores.jpg`).
2. Rode `npm run optimize:images`.
3. Pronto: a foto é padronizada em **quadrado 1:1** (recorte inteligente, focado
   no produto), exportada em **WebP com hash no nome** (cache-bust automático) e
   ligada ao sabor **pelo id** — todos os cards ficam do mesmo tamanho, sem
   editar `menu.ts`.

Os caminhos são gerados em `src/data/generated-images.ts`.
Direção fotográfica, nomes esperados e créditos obrigatórios estão em
[`public/images/products/README.md`](public/images/products/README.md) e
[`CREDITS.md`](public/images/products/CREDITS.md).

Regra principal: **consistência visual > quantidade de fotos**. Não misture
estilos, marcas d'água, logos de terceiros ou imagens sem licença comercial.

## Número do WhatsApp

O número **não** vem preenchido: ajuste em `src/data/config.ts` ou defina a
variável de ambiente `NEXT_PUBLIC_WHATSAPP_NUMBER` (veja `.env.example`).
Formato: internacional, somente dígitos (`5545999999999`).

## Deploy na Vercel

1. Envie o projeto para um repositório Git.
2. Importe o repositório na [Vercel](https://vercel.com/new).
3. A Vercel detecta o Next.js automaticamente — não é preciso configurar nada.
4. (Opcional) Em **Settings → Environment Variables**, defina
   `NEXT_PUBLIC_WHATSAPP_NUMBER`.

## Cadastro do cliente (Supabase, por telefone)

**Sem login, sem OTP, sem SMS, sem senha.** O telefone identifica o cadastro.
O cliente navega e monta o carrinho normalmente; o cadastro só serve para
**preencher os dados automaticamente** nos próximos pedidos. Se as chaves do
Supabase não estiverem configuradas, o app funciona normalmente (sem cadastro).

### Fluxo

1. No **finalizar pedido**, o cliente digita o **WhatsApp** (ou toca em
   **Buscar**).
2. O sistema procura o cadastro por esse telefone:
   - **Existe** → os dados (nome, CEP, rua, número, complemento, bairro, cidade,
     ponto de referência) são preenchidos automaticamente.
   - **Não existe** → o cliente preenche o formulário.
3. Ao enviar o pedido, o cadastro é **salvo/atualizado** na tabela `customers`.
4. O pedido segue normalmente para o **WhatsApp** (com CEP, cidade e referência
   quando disponíveis). Os dados continuam editáveis antes de finalizar.

### 1. Configuração no painel do Supabase

1. **Criar a tabela e as funções de acesso**
   - Painel → **SQL Editor** → **New query** → cole o conteúdo de
     [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   - Cria a tabela `public.customers` (chave única por telefone) e duas funções
     (`get_customer_by_phone`, `upsert_customer`). A tabela fica **bloqueada
     para acesso direto** — o app só usa as funções, então ninguém consegue
     listar todos os clientes pela API.

2. **Pegar as chaves públicas**
   - Painel → **Project Settings → API** → copie **Project URL** e a chave
     **`anon public`**.

### 2. Variáveis de ambiente

Crie `.env.local` (veja [`.env.example`](.env.example)):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://omtvmmvwterkgdbdbikk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=coloque_a_chave_anon_aqui
```

Na **Vercel**, adicione as duas em *Settings → Environment Variables* e faça um
**novo deploy** (variáveis `NEXT_PUBLIC_*` são fixadas no momento do build —
adicionar depois só vale após redeploy). Se o console do site mostrar
`[supabase] ... ausentes neste build`, é sinal de que faltou configurar/redeployar.

> Segurança: use **somente a chave `anon` (pública)** no frontend. Nunca coloque
> a `service_role` no projeto.

> Privacidade: como não há login, quem souber um telefone consegue buscar aquele
> cadastro (comportamento esperado neste fluxo). Em troca, **não é possível
> listar todos os clientes**. Se precisar de mais proteção no futuro, o caminho
> é adicionar OTP.

## Regras implementadas

- Pizza 35 cm: **12 pedaços**, **R$ 60,00**, **até 3 sabores**.
- Pizza 25 cm Brotinho: **4 pedaços**, **R$ 40,00**, **1 sabor**.
- Bordas cobradas à parte — Catupiry R$ 8, Cheddar R$ 8 e Chocolate R$ 10 —
  somadas automaticamente ao valor da pizza.
- Promoção seg/ter/qua: na compra de 1 pizza de 35 cm, 1 Guaraná Kuat 2L grátis
  (o brinde é calculado automaticamente e nunca é cobrado). A seção da promoção
  e o selo nos cards aparecem **apenas** nesses dias, sem enganar o cliente.
- Subtotal + taxa de entrega (R$ 7,00) + total recalculados em tempo real.
- Pedido formatado e enviado pelo WhatsApp oficial (`https://wa.me/...`).
