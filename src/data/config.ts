/**
 * =====================================================================
 * CONFIGURAÇÕES GERAIS DA PIZZARIA
 * ---------------------------------------------------------------------
 * Este é o único lugar onde ficam os dados do negócio.
 * Altere aqui (nome, endereço, taxa de entrega e WhatsApp) sem tocar
 * nos componentes.
 * =====================================================================
 */

export const pizzeria = {
  /** Troque pelo nome real da pizzaria. */
  name: "Forno & Brasa",
  /** Frase curta exibida no topo, convidando o cliente a pedir. */
  tagline: "A pizza quentinha que chega direto na sua porta.",
  address: {
    street: "Rua Londrina, nº 323",
    district: "Jardim Bressan",
    city: "Toledo - PR",
  },
  delivery: {
    city: "Toledo - PR",
    fee: 7,
    headline: "Entregamos em toda a cidade de Toledo - PR.",
  },
} as const;

/**
 * =====================================================================
 * WHATSAPP DA PIZZARIA
 * ---------------------------------------------------------------------
 * IMPORTANTE: o número NÃO foi inventado. Substitua abaixo pelo número
 * real, no formato internacional (código do país + DDD + número), apenas
 * com dígitos. Ex.: 55 45 99999-9999  ->  "5545999999999".
 *
 * Você também pode definir a variável de ambiente:
 *   NEXT_PUBLIC_WHATSAPP_NUMBER=5545999999999
 * (na Vercel: Settings -> Environment Variables)
 * =====================================================================
 */
export const WHATSAPP_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5500000000000"
).replace(/\D/g, "");
