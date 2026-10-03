"use client";

import { CartIcon, ChevronRightIcon } from "@/components/Icons";
import { formatBRL } from "@/lib/format";

interface CartBarProps {
  itemCount: number;
  total: number;
  hasGift: boolean;
  onOpen: () => void;
}

export function CartBar({ itemCount, total, hasGift, onOpen }: CartBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pt-2 pb-safe">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={onOpen}
          className="flex w-full items-center gap-3 rounded-2xl bg-brand-green px-3.5 py-3 text-white shadow-float transition active:scale-[0.99]"
        >
          <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15">
            <CartIcon className="h-6 w-6" />
            <span
              key={itemCount}
              className="anim-pop absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-yellow px-1 text-[11px] font-extrabold text-ink"
            >
              {itemCount}
            </span>
          </span>

          <span className="min-w-0 flex-1 text-left">
            <span className="block font-display text-base font-bold leading-tight">
              Carrinho ({itemCount})
            </span>
            <span className="block truncate text-xs text-white/85">
              {hasGift ? "🎁 Você tem um brinde!" : "Toque para ver seu pedido"}
            </span>
          </span>

          <span className="font-display text-lg font-extrabold">{formatBRL(total)}</span>
          <ChevronRightIcon className="h-5 w-5 text-white/80" />
        </button>
      </div>
    </div>
  );
}
