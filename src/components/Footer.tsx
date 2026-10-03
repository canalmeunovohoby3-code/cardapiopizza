import Image from "next/image";

import { WhatsAppIcon } from "@/components/Icons";
import { pizzeria, WHATSAPP_NUMBER } from "@/data/config";
import { formatBRL } from "@/lib/format";

export function Footer({ reserveCartSpace = false }: { reserveCartSpace?: boolean }) {
  return (
    <footer className="mt-12 bg-ink px-4 py-10 text-white/85">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt={pizzeria.name}
            width={835}
            height={699}
            sizes="160px"
            className="h-16 w-auto"
          />
          <p className="text-xs text-white/70">
            Cardápio digital • pedidos pelo WhatsApp
          </p>
        </div>

        <div className="mt-6 grid gap-5 text-sm sm:grid-cols-2">
          <div>
            <p className="font-semibold text-white">Endereço</p>
            <p className="mt-1">
              {pizzeria.address.street} — {pizzeria.address.district}
              <br />
              {pizzeria.address.city}
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Entrega</p>
            <p className="mt-1">{pizzeria.delivery.headline}</p>
            <p className="mt-1">
              Taxa de entrega:{" "}
              <strong className="text-brand-yellow">
                {formatBRL(pizzeria.delivery.fee)}
              </strong>
            </p>
          </div>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-green px-6 font-display text-base font-bold text-white transition active:scale-[0.98] sm:w-auto"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Pedir pelo WhatsApp
        </a>

        <p className="mt-8 text-xs text-white/50">
          © {new Date().getFullYear()} {pizzeria.name}. Todos os direitos reservados.
        </p>

        {reserveCartSpace ? <div aria-hidden="true" className="h-20" /> : null}
      </div>
    </footer>
  );
}
