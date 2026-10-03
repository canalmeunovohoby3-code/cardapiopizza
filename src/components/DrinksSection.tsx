"use client";

import { DrinkCard } from "@/components/DrinkCard";
import { drinks2L, drinksLata } from "@/data/menu";
import type { DrinkProduct } from "@/types";

interface DrinksSectionProps {
  onAdd: (drink: DrinkProduct) => void;
}

export function DrinksSection({ onAdd }: DrinksSectionProps) {
  return (
    <section
      id="refrigerantes"
      aria-labelledby="refrigerantes-title"
      className="scroll-mt-36 px-4 pt-8"
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="text-2xl">
          🥤
        </span>
        <h2
          id="refrigerantes-title"
          className="font-display text-2xl font-extrabold text-ink"
        >
          Refrigerantes
        </h2>
      </div>

      <h3 className="mt-3 font-display text-sm font-bold uppercase tracking-wide text-ink-soft">
        Garrafa 2 litros
      </h3>
      <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
        {drinks2L.map((drink, index) => (
          <DrinkCard key={drink.id} drink={drink} index={index} onAdd={onAdd} />
        ))}
      </div>

      <h3 className="mt-6 font-display text-sm font-bold uppercase tracking-wide text-ink-soft">
        Latas 350 ml
      </h3>
      <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
        {drinksLata.map((drink, index) => (
          <DrinkCard key={drink.id} drink={drink} index={index} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
