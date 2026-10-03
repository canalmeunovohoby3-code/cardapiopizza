"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { pizzeria } from "@/data/config";
import type { DrinkProduct, EdgeId, FlavorCategory, PizzaSizeId } from "@/types";
import type { CartItem, OrderSummary, PizzaCartItem, PromoGift } from "@/types";
import { createUid } from "@/lib/id";
import { getOrderSummary, getPizzaUnitPrice, getItemCount } from "@/lib/pricing";
import { getPromoGifts, isPromotionDay } from "@/lib/promotions";
import { loadCart, saveCart } from "@/lib/cart-storage";

interface AddPizzaInput {
  category: FlavorCategory;
  sizeId: PizzaSizeId;
  flavorIds: string[];
  edgeId: EdgeId;
  quantity: number;
}

interface EditPizzaInput {
  sizeId: PizzaSizeId;
  flavorIds: string[];
  edgeId: EdgeId;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  itemCount: number;
  summary: OrderSummary;
  gifts: PromoGift[];
  isPromoActive: boolean;
  addPizza: (input: AddPizzaInput) => void;
  editPizza: (uid: string, input: EditPizzaInput) => void;
  addDrink: (drink: DrinkProduct, quantity?: number) => void;
  updateQuantity: (uid: string, quantity: number) => void;
  removeItem: (uid: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function flavorKey(flavorIds: string[]): string {
  return [...flavorIds].sort().join("|");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hidratação a partir do localStorage (sistema externo ao React).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCart(items);
  }, [items, hydrated]);

  // Dia da promoção lido do relógio do dispositivo, sem quebrar a
  // hidratação (servidor usa `false`, cliente usa a data real).
  const subscribe = useCallback(() => () => {}, []);
  const getSnapshot = useCallback(() => {
    const forced = process.env.NEXT_PUBLIC_FORCE_PROMO;
    if (forced === "on") return true;
    if (forced === "off") return false;
    return isPromotionDay(new Date());
  }, []);
  const getServerSnapshot = useCallback(
    () => process.env.NEXT_PUBLIC_FORCE_PROMO === "on",
    [],
  );
  const isPromoActive = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const addPizza = useCallback((input: AddPizzaInput) => {
    const quantity = Math.max(1, Math.round(input.quantity));
    setItems((prev) => {
      const wanted = flavorKey(input.flavorIds);
      const index = prev.findIndex(
        (item) =>
          item.kind === "pizza" &&
          item.sizeId === input.sizeId &&
          item.edgeId === input.edgeId &&
          flavorKey(item.flavorIds) === wanted,
      );

      if (index >= 0) {
        const next = [...prev];
        const existing = next[index] as PizzaCartItem;
        next[index] = { ...existing, quantity: existing.quantity + quantity };
        return next;
      }

      const item: PizzaCartItem = {
        uid: createUid(),
        kind: "pizza",
        category: input.category,
        sizeId: input.sizeId,
        flavorIds: input.flavorIds,
        edgeId: input.edgeId,
        quantity,
        unitPrice: getPizzaUnitPrice(input.sizeId, input.edgeId),
      };
      return [...prev, item];
    });
  }, []);

  const editPizza = useCallback((uid: string, input: EditPizzaInput) => {
    const quantity = Math.max(1, Math.round(input.quantity));
    setItems((prev) =>
      prev.map((item) =>
        item.uid === uid && item.kind === "pizza"
          ? {
              ...item,
              sizeId: input.sizeId,
              flavorIds: input.flavorIds,
              edgeId: input.edgeId,
              quantity,
              unitPrice: getPizzaUnitPrice(input.sizeId, input.edgeId),
            }
          : item,
      ),
    );
  }, []);

  const addDrink = useCallback((drink: DrinkProduct, quantity = 1) => {
    const qty = Math.max(1, Math.round(quantity));
    setItems((prev) => {
      const index = prev.findIndex(
        (item) => item.kind === "drink" && item.productId === drink.id,
      );
      if (index >= 0) {
        const next = [...prev];
        const existing = next[index];
        next[index] = { ...existing, quantity: existing.quantity + qty };
        return next;
      }
      return [
        ...prev,
        {
          uid: createUid(),
          kind: "drink" as const,
          productId: drink.id,
          name: drink.name,
          quantity: qty,
          unitPrice: drink.price,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((uid: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.uid === uid ? { ...item, quantity: Math.round(quantity) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((uid: string) => {
    setItems((prev) => prev.filter((item) => item.uid !== uid));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const gifts = useMemo(
    () => getPromoGifts(items, isPromoActive),
    [items, isPromoActive],
  );

  const summary = useMemo(
    () => getOrderSummary(items, pizzeria.delivery.fee),
    [items],
  );

  const itemCount = useMemo(() => getItemCount(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      hydrated,
      itemCount,
      summary,
      gifts,
      isPromoActive,
      addPizza,
      editPizza,
      addDrink,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      hydrated,
      itemCount,
      summary,
      gifts,
      isPromoActive,
      addPizza,
      editPizza,
      addDrink,
      updateQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart precisa estar dentro de <CartProvider>.");
  }
  return context;
}
