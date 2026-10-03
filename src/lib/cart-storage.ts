import type { CartItem } from "@/types";

const CART_KEY = "pizzaria.cart.v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadCart(): CartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidCartItem);
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    /* armazenamento indisponível — segue sem persistência */
  }
}

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  if (typeof item.uid !== "string" || typeof item.quantity !== "number") return false;
  if (typeof item.unitPrice !== "number") return false;
  if (item.kind === "pizza") {
    return (
      typeof item.sizeId === "string" &&
      typeof item.edgeId === "string" &&
      Array.isArray(item.flavorIds)
    );
  }
  if (item.kind === "drink") {
    return typeof item.productId === "string" && typeof item.name === "string";
  }
  return false;
}
