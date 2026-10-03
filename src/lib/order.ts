import { edgeById, flavorsById, pizzaSizeById } from "@/data/menu";
import { formatBRL } from "@/lib/format";
import type { CartItem, PaymentMethod } from "@/types";

export const paymentLabels: Record<PaymentMethod, string> = {
  dinheiro: "Dinheiro",
  pix: "Pix",
  credito: "Cartão de crédito",
  debito: "Cartão de débito",
};

export interface DescribedItem {
  title: string;
  flavorNames: string[];
  flavorLine: string | null;
  edgeLine: string | null;
  /** Valor só do tamanho (sem a borda), usado na mensagem do WhatsApp. */
  baseTotal: number;
  /** Valor total da linha (com borda), usado no carrinho. */
  total: number;
}

export function describeItem(item: CartItem): DescribedItem {
  if (item.kind === "drink") {
    return {
      title: item.name,
      flavorNames: [],
      flavorLine: null,
      edgeLine: null,
      baseTotal: item.unitPrice * item.quantity,
      total: item.unitPrice * item.quantity,
    };
  }

  const size = pizzaSizeById[item.sizeId];
  const edge = edgeById[item.edgeId];
  const flavorNames = item.flavorIds
    .map((id) => flavorsById[id]?.name)
    .filter((name): name is string => Boolean(name));

  const edgeLine =
    edge.price > 0
      ? `${edge.shortName} — ${formatBRL(edge.price * item.quantity)}`
      : null;

  return {
    title: size.name,
    flavorNames,
    flavorLine: flavorNames.length > 0 ? flavorNames.join(" + ") : null,
    edgeLine,
    baseTotal: size.price * item.quantity,
    total: item.unitPrice * item.quantity,
  };
}
