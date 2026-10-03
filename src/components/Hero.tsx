import { LogoMark } from "@/components/Logo";
import { ChevronRightIcon, MapPinIcon, TruckIcon } from "@/components/Icons";
import { pizzeria } from "@/data/config";
import { formatBRL } from "@/lib/format";

export function Hero() {
  return (
    <section className="px-4 pt-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green to-brand-green-dark px-5 py-7 text-white shadow-card sm:px-8 sm:py-10">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-yellow/25"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-brand-red/20"
        />

        <div className="relative max-w-xl">
          <LogoMark className="h-14 w-14 rounded-2xl shadow-lg" />

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand-yellow">
            Cardápio digital
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            {pizzeria.name}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/90 sm:text-base">
            {pizzeria.tagline}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href="#cardapio"
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-brand-yellow px-6 font-display text-base font-bold text-ink shadow-sm transition active:scale-[0.98]"
            >
              Ver cardápio
              <ChevronRightIcon className="h-5 w-5" />
            </a>
            <a
              href="#entrega"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/35 px-6 font-display text-base font-semibold text-white transition active:scale-[0.98]"
            >
              Como funciona a entrega
            </a>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/90 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <TruckIcon className="h-4 w-4 text-brand-yellow" />
              {pizzeria.delivery.headline}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPinIcon className="h-4 w-4 text-brand-yellow" />
              Taxa de entrega {formatBRL(pizzeria.delivery.fee)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
