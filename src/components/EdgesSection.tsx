"use client";

import { edges } from "@/data/menu";
import { formatBRL } from "@/lib/format";

export function EdgesSection() {
  return (
    <section id="bordas" aria-labelledby="bordas-title" className="scroll-mt-36 px-4 pt-8">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="text-2xl">
          🧀
        </span>
        <h2 id="bordas-title" className="font-display text-2xl font-extrabold text-ink">
          Bordas
        </h2>
      </div>
      <p className="mt-1 text-xs text-ink-soft">
        As bordas são cobradas separadamente e somadas automaticamente ao valor da pizza.
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {edges.map((edge) => (
          <div
            key={edge.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-card"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span aria-hidden="true" className="text-2xl">
                {edge.emoji}
              </span>
              <div className="min-w-0">
                <p className="font-display text-base font-bold text-ink">{edge.name}</p>
                <p className="text-xs text-ink-soft">
                  {edge.price > 0
                    ? `Adicione durante a montagem da pizza`
                    : "Sua pizza do jeitinho tradicional"}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-brand-green-soft px-3 py-1 font-display text-sm font-extrabold text-brand-green">
              {edge.price > 0 ? `+ ${formatBRL(edge.price)}` : "Inclusa"}
            </span>
          </div>
        ))}
      </div>

      <a
        href="#pizzas-salgadas"
        className="mt-3 inline-flex h-11 items-center justify-center rounded-full bg-brand-green px-5 font-display text-sm font-bold text-white transition active:scale-[0.98]"
      >
        Montar minha pizza
      </a>
    </section>
  );
}
