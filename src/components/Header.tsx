import Image from "next/image";

import { WhatsAppIcon } from "@/components/Icons";
import { pizzeria, WHATSAPP_NUMBER } from "@/data/config";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4">
        <Image
          src="/images/logo.png"
          alt={pizzeria.name}
          width={835}
          height={699}
          priority
          sizes="120px"
          className="h-12 w-auto shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-ink-soft">
            Entrega em {pizzeria.address.city}
          </p>
        </div>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com a pizzaria no WhatsApp"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-green text-white shadow-sm transition active:scale-95"
        >
          <WhatsAppIcon className="h-5 w-5" />
        </a>
      </div>
    </header>
  );
}
