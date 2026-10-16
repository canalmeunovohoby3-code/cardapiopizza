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
  /** Rótulo dos sabores: "Sabores" (pizza) ou "Pizza 35 cm" (combo). */
  flavorLabel: string | null;
  flavorLine: string | null;
  edgeLine: string | null;
  /** Itens fixos de um combo (ex.: "Brotinho de Chocolate", "Coca-Cola 2L"). */
  extraLines: string[];
  /** Valor só do tamanho (sem a borda), usado na mensagem do WhatsApp. */
  baseTotal: number;
  /** Valor total da linha (com borda), usado no carrinho. */
  total: number;
}

function flavorNamesOf(flavorIds: string[]): string[] {
  return flavorIds
    .map((id) => flavorsById[id]?.name)
    .filter((name): name is string => Boolean(name));
}

export function describeItem(item: CartItem): DescribedItem {
  if (item.kind === "drink") {
    const total = item.unitPrice * item.quantity;
    return {
      title: item.name,
      flavorNames: [],
      flavorLabel: null,
      flavorLine: null,
      edgeLine: null,
      extraLines: [],
      baseTotal: total,
      total,
    };
  }

  if (item.kind === "combo") {
    const flavorNames = flavorNamesOf(item.flavorIds);
    const total = item.unitPrice * item.quantity;
    return {
      title: item.name,
      flavorNames,
      flavorLabel: "Pizza 35 cm",
      flavorLine: flavorNames.length > 0 ? flavorNames.join(" + ") : null,
      edgeLine: null,
      extraLines: item.includes,
      baseTotal: total,
      total,
    };
  }

  const size = pizzaSizeById[item.sizeId];
  const edge = edgeById[item.edgeId];
  const flavorNames = flavorNamesOf(item.flavorIds);

  const edgeLine =
    edge.price > 0
      ? `${edge.shortName} — ${formatBRL(edge.price * item.quantity)}`
      : null;

  return {
    title: size.name,
    flavorNames,
    flavorLabel: "Sabores",
    flavorLine: flavorNames.length > 0 ? flavorNames.join(" + ") : null,
    edgeLine,
    extraLines: [],
    baseTotal: size.price * item.quantity,
    total: item.unitPrice * item.quantity,
  };
}
