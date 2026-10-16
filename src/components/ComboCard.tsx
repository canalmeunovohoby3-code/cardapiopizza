"use client";

import { ProductArt } from "@/components/art/ProductArt";
import { GiftIcon } from "@/components/Icons";
import { formatBRL } from "@/lib/format";
import type { ComboProduct } from "@/types";

interface ComboCardProps {
  combo: ComboProduct;
  index: number;
  onSelect: (combo: ComboProduct) => void;
}

export function ComboCard({ combo, index, onSelect }: ComboCardProps) {
  return (
    <article
      className="anim-fade-up flex flex-col overflow-hidden rounded-3xl border border-brand-yellow/70 bg-white shadow-card"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <ProductArt
        kind="pizza"
        id="combo"
        image={combo.image}
        aspect={combo.imageAspect}
        alt={combo.name}
        className="w-full"
      />

      <div className="flex flex-1 flex-col p-3.5">
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-brand-yellow px-2.5 py-0.5 text-[11px] font-extrabold text-ink">
          <GiftIcon className="h-3.5 w-3.5" />
          COMBO
        </span>
        <h3 className="mt-1.5 font-display text-lg font-extrabold text-ink">
          {combo.name}
        </h3>
        <p className="mt-1 line-clamp-2 min-h-8 text-xs leading-relaxed text-ink-soft sm:text-sm">
          {combo.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="font-display text-2xl font-extrabold text-brand-green">
            {formatBRL(combo.price)}
          </span>
          <button
            type="button"
            onClick={() => onSelect(combo)}
            className="h-11 rounded-full bg-brand-green px-5 font-display text-sm font-bold text-white transition active:scale-[0.98]"
          >
            Montar combo
          </button>
        </div>
      </div>
    </article>
  );
}
