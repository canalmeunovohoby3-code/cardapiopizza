"use client";

import { PizzaFlavorCard } from "@/components/PizzaFlavorCard";
import { pizzaSizes } from "@/data/menu";
import { formatBRL } from "@/lib/format";
import type { Flavor, FlavorCategory, PizzaSizeId } from "@/types";

interface PizzaSectionProps {
  id: "pizzas-salgadas" | "pizzas-doces";
  title: string;
  emoji: string;
  category: FlavorCategory;
  flavors: Flavor[];
  note?: string;
  isPromoActive: boolean;
  /** Marca a primeira foto como prioritária (LCP) quando houver foto real. */
  priorityFirst?: boolean;
  onSelectFlavor: (category: FlavorCategory, sizeId: PizzaSizeId, flavorId?: string) => void;
  onSelectSize: (category: FlavorCategory, sizeId: PizzaSizeId) => void;
}

export function PizzaSection({
  id,
  title,
  emoji,
  category,
  flavors,
  note,
  isPromoActive,
  priorityFirst = false,
  onSelectFlavor,
  onSelectSize,
}: PizzaSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-36 px-4 pt-8">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="text-2xl">
          {emoji}
        </span>
        <h2 id={`${id}-title`} className="font-display text-2xl font-extrabold text-ink">
          {title}
        </h2>
      </div>
      {note ? <p className="mt-1 text-xs text-ink-soft">{note}</p> : null}

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {pizzaSizes.map((size) => (
          <button
            key={size.id}
            type="button"
            onClick={() => onSelectSize(category, size.id)}
            className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-left shadow-card transition active:scale-[0.99]"
          >
            <span className="min-w-0">
              <span className="block font-display text-base font-bold text-ink">
                {size.name}
              </span>
              <span className="block text-xs text-ink-soft">
                {size.slices} pedaços · até {size.maxFlavors}{" "}
                {size.maxFlavors > 1 ? "sabores" : "sabor"}
              </span>
            </span>
            <span className="shrink-0 rounded-full bg-brand-yellow px-3 py-1 font-display text-sm font-extrabold text-ink">
              {formatBRL(size.price)}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {flavors.map((flavor, index) => (
          <PizzaFlavorCard
            key={flavor.id}
            flavor={flavor}
            index={index}
            isPromoActive={isPromoActive}
            priority={priorityFirst && index === 0}
            onSelect={(flavorId, sizeId) => onSelectFlavor(category, sizeId, flavorId)}
          />
        ))}
      </div>
    </section>
  );
}
