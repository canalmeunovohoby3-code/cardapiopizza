"use client";

import { ComboCard } from "@/components/ComboCard";
import { combos } from "@/data/menu";
import type { ComboProduct } from "@/types";

interface CombosSectionProps {
  onSelect: (combo: ComboProduct) => void;
}

export function CombosSection({ onSelect }: CombosSectionProps) {
  return (
    <section id="combos" aria-labelledby="combos-title" className="scroll-mt-36 px-4 pt-6">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="text-2xl">
          🎉
        </span>
        <h2 id="combos-title" className="font-display text-2xl font-extrabold text-ink">
          Combos
        </h2>
      </div>
      <p className="mt-1 text-xs text-ink-soft">
        Escolha o sabor da pizza grande e aproveite.
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {combos.map((combo, index) => (
          <ComboCard
            key={combo.id}
            combo={combo}
            index={index}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
