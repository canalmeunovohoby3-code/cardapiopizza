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
  /** Nome exibido em textos/metadata (a logomarca está em /images/logo.png). */
  name: "Felipe's Pizzaria",
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
 * Número no formato internacional (país + DDD + número), apenas dígitos.
 * (45) 99856-3187  ->  "5545998563187".
 *
 * Pode ser sobrescrito pela variável de ambiente:
 *   NEXT_PUBLIC_WHATSAPP_NUMBER=5545998563187
 * (na Vercel: Settings -> Environment Variables)
 * =====================================================================
 */
export const WHATSAPP_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5545998563187"
).replace(/\D/g, "");
