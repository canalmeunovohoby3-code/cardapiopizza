import { edgeById, pizzaSizeById } from "@/data/menu";
import type { CartItem, EdgeId, OrderSummary, PizzaSizeId } from "@/types";

export function getSizePrice(sizeId: PizzaSizeId): number {
  return pizzaSizeById[sizeId]?.price ?? 0;
}

export function getEdgePrice(edgeId: EdgeId): number {
  return edgeById[edgeId]?.price ?? 0;
}

/** Preço unitário da pizza = tamanho + borda. */
export function getPizzaUnitPrice(sizeId: PizzaSizeId, edgeId: EdgeId): number {
  return getSizePrice(sizeId) + getEdgePrice(edgeId);
}

export function getItemSubtotal(item: CartItem): number {
  return item.unitPrice * item.quantity;
}

/** Soma apenas dos itens pagos (brindes entram com valor 0). */
export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + getItemSubtotal(item), 0);
}

export function getItemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getOrderSummary(
  items: CartItem[],
  deliveryFee: number,
): OrderSummary {
  const subtotal = getCartSubtotal(items);
  const fee = items.length > 0 ? deliveryFee : 0;
  return {
    subtotal,
    deliveryFee: fee,
    total: subtotal + fee,
  };
}
