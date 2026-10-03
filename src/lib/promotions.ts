import {
  weekdayGiftPromotion,
  type WeekdayGiftPromotion,
} from "@/data/promotions";
import type { CartItem, PromoGift } from "@/types";

export function isPromotionDay(
  date: Date,
  promotion: WeekdayGiftPromotion = weekdayGiftPromotion,
): boolean {
  if (!promotion.enabled) return false;
  return promotion.days.includes(date.getDay());
}

/** Quantas pizzas participantes (35 cm) existem no carrinho. */
export function countEligiblePizzas(
  items: CartItem[],
  promotion: WeekdayGiftPromotion = weekdayGiftPromotion,
): number {
  return items.reduce((total, item) => {
    if (item.kind !== "pizza") return total;
    if (item.sizeId !== promotion.requiredSizeId) return total;
    return total + item.quantity;
  }, 0);
}

/**
 * Brinde calculado a partir do carrinho. Nunca é armazenado como item
 * pago: é sempre derivado, então nunca é cobrado e se ajusta sozinho
 * quando o cliente muda as pizzas.
 */
export function getPromoGifts(
  items: CartItem[],
  isPromoDay: boolean,
  promotion: WeekdayGiftPromotion = weekdayGiftPromotion,
): PromoGift[] {
  if (!isPromoDay) return [];
  const eligible = countEligiblePizzas(items, promotion);
  if (eligible <= 0) return [];
  const quantity = eligible * promotion.giftsPerPizza;
  return [
    {
      id: promotion.gift.id,
      name: promotion.gift.name,
      emoji: promotion.gift.emoji,
      quantity,
      unitPrice: 0,
    },
  ];
}
