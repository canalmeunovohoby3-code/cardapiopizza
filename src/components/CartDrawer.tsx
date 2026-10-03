"use client";

import { useEffect, useRef } from "react";

import { CartItemRow } from "@/components/CartItemRow";
import { CartIcon, CloseIcon, GiftIcon } from "@/components/Icons";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/format";
import type { PizzaCartItem } from "@/types";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onEdit: (item: PizzaCartItem) => void;
  onCheckout: () => void;
}

export function CartDrawer({ open, onClose, onEdit, onCheckout }: CartDrawerProps) {
  const {
    items,
    gifts,
    summary,
    itemCount,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => panelRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  if (!open) return null;

  const isEmpty = items.length === 0;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="anim-fade-in absolute inset-0 bg-ink/55"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
        tabIndex={-1}
        className="drawer-panel absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-3xl bg-cream shadow-float outline-none sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:h-full sm:w-[420px] sm:rounded-l-3xl sm:rounded-t-none"
      >
        <header className="flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3.5">
          <div>
            <h2 className="font-display text-lg font-extrabold text-ink">Seu pedido</h2>
            <p className="text-xs text-ink-soft">
              {itemCount} {itemCount === 1 ? "item" : "itens"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar carrinho"
            className="grid h-10 w-10 place-items-center rounded-full bg-cream-2 text-ink-soft transition active:scale-95"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-cream-2 text-ink-soft">
              <CartIcon className="h-8 w-8" />
            </span>
            <p className="font-display text-lg font-bold text-ink">
              Seu carrinho está vazio
            </p>
            <p className="text-sm text-ink-soft">
              Escolha uma pizza ou bebida para começar seu pedido.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-1 h-11 rounded-full bg-brand-green px-6 font-display text-sm font-bold text-white transition active:scale-95"
            >
              Ver cardápio
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4">
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <CartItemRow
                  key={item.uid}
                  item={item}
                  onChangeQuantity={updateQuantity}
                  onRemove={removeItem}
                  onEdit={onEdit}
                />
              ))}
            </ul>

            {gifts.map((gift) => (
              <div
                key={gift.id}
                className="my-3 flex items-center gap-3 rounded-2xl border border-brand-green/30 bg-brand-green-soft p-3"
              >
                <span aria-hidden="true" className="text-2xl">
                  {gift.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-bold text-ink">
                    {gift.quantity > 1 ? `${gift.quantity}x ` : ""}
                    {gift.name}
                  </p>
                  <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-green">
                    <GiftIcon className="h-3.5 w-3.5" />
                    Brinde da promoção — não é cobrado
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-brand-green px-2.5 py-1 text-[11px] font-extrabold text-white">
                  GRÁTIS
                </span>
              </div>
            ))}

            <button
              type="button"
              onClick={clearCart}
              className="my-3 text-xs font-semibold text-ink-soft underline underline-offset-2"
            >
              Limpar carrinho
            </button>
          </div>
        )}

        {!isEmpty ? (
          <footer className="border-t border-line bg-white px-4 pt-3 pb-safe">
            <dl className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-semibold text-ink">{formatBRL(summary.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-soft">Taxa de entrega</dt>
                <dd className="font-semibold text-ink">
                  {formatBRL(summary.deliveryFee)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-2">
                <dt className="font-display text-base font-bold text-ink">Total</dt>
                <dd className="font-display text-lg font-extrabold text-brand-green">
                  {formatBRL(summary.total)}
                </dd>
              </div>
            </dl>

            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={onCheckout}
                className="h-12 w-full rounded-full bg-brand-green font-display text-base font-bold text-white transition active:scale-[0.98]"
              >
                Finalizar pedido
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 w-full rounded-full border border-line font-display text-sm font-bold text-ink transition active:scale-[0.98]"
              >
                Adicionar mais itens
              </button>
            </div>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
