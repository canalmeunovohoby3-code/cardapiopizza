"use client";

import { GiftIcon } from "@/components/Icons";
import { pizzaSizes } from "@/data/menu";
import { weekdayGiftPromotion } from "@/data/promotions";
import { formatBRL } from "@/lib/format";

export function PromoBanner() {
  const grandao = pizzaSizes[0];

  return (
    <section id="promocao" aria-labelledby="promo-title" className="scroll-mt-36 px-4 pt-6">
      <div className="relative overflow-hidden rounded-3xl border border-brand-yellow/60 bg-brand-yellow-soft p-4 shadow-card sm:p-6">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-red/10"
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              <GiftIcon className="h-3.5 w-3.5" />
              Promoção ativa hoje
            </span>

            <h2
              id="promo-title"
              className="mt-2 font-display text-xl font-extrabold leading-tight text-ink sm:text-2xl"
            >
              {weekdayGiftPromotion.headline}
            </h2>
            <p className="mt-1 max-w-md text-sm text-ink-soft">
              {weekdayGiftPromotion.description}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-1.5 rounded-2xl bg-white/80 p-3 text-sm sm:min-w-52">
            <div className="flex items-center justify-between gap-4">
              <span className="text-ink-soft">
                🍕 Pizza 35 cm · {grandao.slices} pedaços
              </span>
              <strong className="font-display font-extrabold text-ink">
                {formatBRL(grandao.price)}
              </strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-ink-soft">🥤 Guaraná Kuat 2L</span>
              <strong className="font-display font-extrabold text-brand-green">
                GRÁTIS
              </strong>
            </div>
            <p className="mt-1 text-[11px] leading-snug text-ink-soft">
              Até {grandao.maxFlavors} sabores na pizza de {grandao.shortLabel}. O brinde é
              adicionado automaticamente no carrinho.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
