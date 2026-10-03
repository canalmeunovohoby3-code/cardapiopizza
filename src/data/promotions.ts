/**
 * =====================================================================
 * PROMOÇÕES
 * ---------------------------------------------------------------------
 * Regra atual: de segunda a quarta-feira, na compra de uma pizza de
 * 35 cm (sizeId "grande"), o cliente ganha 1 Guaraná Kuat de 2 litros.
 * O brinde é calculado automaticamente pelo carrinho e nunca é cobrado.
 * =====================================================================
 */

export interface WeekdayGiftPromotion {
  id: string;
  enabled: boolean;
  /** Dias da semana em que a promoção vale (0=domingo ... 3=quarta). */
  days: number[];
  /** Tamanho de pizza que ativa o brinde. */
  requiredSizeId: "grande";
  /** Quantos brindes o cliente ganha por pizza participante. */
  giftsPerPizza: number;
  gift: {
    id: string;
    name: string;
    emoji: string;
  };
  headline: string;
  description: string;
  badge: string;
}

export const weekdayGiftPromotion: WeekdayGiftPromotion = {
  id: "promo-kuat-2l",
  enabled: true,
  // 1 = segunda, 2 = terça, 3 = quarta
  days: [1, 2, 3],
  requiredSizeId: "grande",
  giftsPerPizza: 1,
  gift: {
    id: "kuat-2l",
    name: "Guaraná Kuat 2L",
    emoji: "🥤",
  },
  headline: "Promoção — segunda, terça e quarta",
  description:
    "Na compra de uma pizza de 35 cm, ganhe 1 Guaraná Kuat de 2 litros.",
  badge: "GANHE GUARANÁ Kuat 2L",
};
