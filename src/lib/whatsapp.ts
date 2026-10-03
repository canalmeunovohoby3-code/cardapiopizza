import { pizzeria } from "@/data/config";
import { edgeById } from "@/data/menu";
import { formatBRL } from "@/lib/format";
import { describeItem, paymentLabels } from "@/lib/order";
import type { CartItem, CheckoutCustomer, OrderSummary, PromoGift } from "@/types";

interface BuildOrderMessageInput {
  items: CartItem[];
  gifts: PromoGift[];
  summary: OrderSummary;
  customer: CheckoutCustomer;
}

export function buildOrderMessage({
  items,
  gifts,
  summary,
  customer,
}: BuildOrderMessageInput): string {
  const lines: string[] = [];

  lines.push("🍕 *NOVO PEDIDO*");
  lines.push("");
  lines.push(`*Cliente:* ${customer.name.trim()}`);
  if (customer.whatsapp.trim()) {
    lines.push(`*WhatsApp:* ${customer.whatsapp.trim()}`);
  }
  lines.push("");

  lines.push("*Pedido:*");
  lines.push("");

  items.forEach((item) => {
    const described = describeItem(item);
    lines.push(`${item.quantity}x ${described.title} — ${formatBRL(described.baseTotal)}`);

    if (item.kind === "pizza") {
      const edge = edgeById[item.edgeId];
      if (described.flavorLine) {
        lines.push(`Sabores: ${described.flavorLine}`);
      }
      if (described.edgeLine) {
        lines.push(`Borda: ${edge.shortName} — ${formatBRL(edge.price * item.quantity)}`);
      }
    }
    lines.push("");
  });

  gifts.forEach((gift) => {
    const prefix = gift.quantity > 1 ? `${gift.quantity}x ` : "";
    lines.push(`🎁 ${prefix}${gift.name} — GRÁTIS`);
  });

  if (gifts.length > 0) {
    lines.push("");
  }

  lines.push(`*Subtotal:* ${formatBRL(summary.subtotal)}`);
  lines.push(`*Entrega:* ${formatBRL(summary.deliveryFee)}`);
  lines.push(`*TOTAL:* ${formatBRL(summary.total)}`);
  lines.push("");

  lines.push("📍 *Endereço de entrega:*");
  lines.push(`${customer.address.trim()}, ${customer.number.trim()}`);
  lines.push(`Bairro: ${customer.district.trim()}`);
  if (customer.complement.trim()) {
    lines.push(`Complemento: ${customer.complement.trim()}`);
  }
  if (customer.reference?.trim()) {
    lines.push(`Referência: ${customer.reference.trim()}`);
  }
  lines.push(customer.city?.trim() || pizzeria.address.city);
  if (customer.cep?.trim()) {
    lines.push(`CEP: ${customer.cep.trim()}`);
  }
  lines.push("");

  lines.push(`💳 *Pagamento:* ${paymentLabels[customer.payment]}`);
  if (customer.payment === "dinheiro" && customer.change.trim()) {
    lines.push(`💰 *Troco para:* ${customer.change.trim()}`);
  }
  lines.push("");

  if (customer.notes.trim()) {
    lines.push(`📝 *Observação:* ${customer.notes.trim()}`);
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(phone: string, message: string): void {
  const url = buildWhatsAppUrl(phone, message);
  window.open(url, "_blank", "noopener,noreferrer");
}
