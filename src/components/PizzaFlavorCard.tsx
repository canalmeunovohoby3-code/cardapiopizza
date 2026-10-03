"use client";

import { ProductArt } from "@/components/art/ProductArt";
import { GiftIcon } from "@/components/Icons";
import { pizzaSizes } from "@/data/menu";
import { weekdayGiftPromotion } from "@/data/promotions";
import { formatBRL } from "@/lib/format";
import type { Flavor, PizzaSizeId } from "@/types";

interface PizzaFlavorCardProps {
  flavor: Flavor;
  isPromoActive: boolean;
  index: number;
  priority?: boolean;
  onSelect: (flavorId: string, sizeId: PizzaSizeId) => void;
}

export function PizzaFlavorCard({
  flavor,
  isPromoActive,
  index,
  priority = false,
  onSelect,
}: PizzaFlavorCardProps) {
  const [grande, brotinho] = pizzaSizes;

  return (
    <article
      className="anim-fade-up flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <ProductArt
        kind="pizza"
        id={flavor.id}
        image={flavor.image}
        alt={`Pizza de ${flavor.name}`}
        priority={priority}
        aspect={flavor.imageAspect}
        className="w-full"
      />

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="truncate font-display text-lg font-bold leading-tight text-ink">
          {flavor.name}
        </h3>
        <p className="mt-1 line-clamp-2 min-h-8 text-xs leading-relaxed text-ink-soft sm:text-sm">
          {flavor.description}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-brand-green-soft px-2 py-0.5 text-[11px] font-bold text-brand-green">
            {grande.shortLabel} · {formatBRL(grande.price)}
          </span>
          <span className="rounded-full bg-cream-3 px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
            Brotinho · {formatBRL(brotinho.price)}
          </span>
        </div>

        {isPromoActive ? (
          <p className="mt-2.5 inline-flex items-center gap-1.5 self-start rounded-xl bg-brand-yellow-soft px-3 py-1.5 text-[11px] font-bold text-ink">
            <GiftIcon className="h-3.5 w-3.5" />
            {weekdayGiftPromotion.badge} na {grande.shortLabel}
          </p>
        ) : null}

        <div className="mt-auto flex gap-2 pt-3">
          <button
            type="button"
            onClick={() => onSelect(flavor.id, "grande")}
            className="h-11 flex-1 rounded-full bg-brand-green px-3 font-display text-sm font-bold text-white transition active:scale-[0.98]"
          >
            Montar {grande.shortLabel}
          </button>
          <button
            type="button"
            onClick={() => onSelect(flavor.id, "brotinho")}
            className="h-11 flex-1 rounded-full border border-brand-green/40 px-3 font-display text-sm font-bold text-brand-green transition active:scale-[0.98]"
          >
            Brotinho
          </button>
        </div>
      </div>
    </article>
  );
}
