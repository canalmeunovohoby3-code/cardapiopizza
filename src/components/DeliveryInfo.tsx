import { MapPinIcon, TruckIcon, WhatsAppIcon } from "@/components/Icons";
import { pizzeria, WHATSAPP_NUMBER } from "@/data/config";
import { formatBRL } from "@/lib/format";

export function DeliveryInfo() {
  return (
    <section id="entrega" aria-labelledby="entrega-title" className="scroll-mt-36 px-4 pt-8">
      <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2
          id="entrega-title"
          className="font-display text-xl font-extrabold text-ink sm:text-2xl"
        >
          Entrega
        </h2>
        <p className="mt-1 text-sm text-ink-soft sm:text-base">
          {pizzeria.delivery.headline}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl bg-brand-green-soft p-3.5">
            <TruckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
            <div>
              <p className="text-sm font-semibold text-ink">Taxa fixa de entrega</p>
              <p className="font-display text-lg font-extrabold text-brand-green">
                {formatBRL(pizzeria.delivery.fee)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-cream-2 p-3.5">
            <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
            <div>
              <p className="text-sm font-semibold text-ink">Endereço da pizzaria</p>
              <p className="text-sm text-ink-soft">
                {pizzeria.address.street} — {pizzeria.address.district}
                <br />
                {pizzeria.address.city}
              </p>
            </div>
          </div>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-green px-6 font-display text-base font-bold text-white shadow-sm transition active:scale-[0.98] sm:w-auto"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Pedir pelo WhatsApp
        </a>
      </div>
    </section>
  );
}
