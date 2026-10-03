"use client";

import { ProductArt } from "@/components/art/ProductArt";
import { PlusIcon } from "@/components/Icons";
import { formatBRL } from "@/lib/format";
import type { DrinkProduct } from "@/types";

interface DrinkCardProps {
  drink: DrinkProduct;
  index: number;
  onAdd: (drink: DrinkProduct) => void;
}

export function DrinkCard({ drink, index, onAdd }: DrinkCardProps) {
  return (
    <article
      className="anim-fade-up flex items-center gap-3 rounded-2xl border border-line bg-white p-2.5 shadow-card"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <ProductArt
        kind="drink"
        id={drink.id}
        image={drink.image}
        alt={drink.name}
        sizes="64px"
        aspect={drink.imageAspect}
        className="h-16 w-16 shrink-0 rounded-2xl"
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-base font-bold text-ink">
          {drink.shortName}
        </h3>
        <p className="truncate text-xs text-ink-soft">{drink.name}</p>
        <p className="mt-0.5 font-display text-base font-extrabold text-brand-green">
          {formatBRL(drink.price)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onAdd(drink)}
        aria-label={`Adicionar ${drink.name} ao carrinho`}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-green text-white transition active:scale-95"
      >
        <PlusIcon className="h-5 w-5" />
      </button>
    </article>
  );
}
