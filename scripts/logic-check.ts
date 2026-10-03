import { normalizePhone } from "@/lib/customers";
import { formatBRL } from "@/lib/format";
import { getOrderSummary, getPizzaUnitPrice } from "@/lib/pricing";
import {
  countEligiblePizzas,
  getPromoGifts,
  isPromotionDay,
} from "@/lib/promotions";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { CartItem, CheckoutCustomer } from "@/types";

let failures = 0;
function check(label: string, condition: boolean, detail?: unknown) {
  const status = condition ? "OK  " : "FAIL";
  if (!condition) failures += 1;
  console.log(`[${status}] ${label}${detail !== undefined ? ` -> ${JSON.stringify(detail)}` : ""}`);
}

// 1) Preço unitário: pizza 35 cm (60) + borda catupiry (8) = 68
check("pizza 35 + catupiry = 68", getPizzaUnitPrice("grande", "catupiry") === 68);
// brotinho com cheddar = 48
check("brotinho + cheddar = 48", getPizzaUnitPrice("brotinho", "cheddar") === 48);

const pizza: CartItem = {
  uid: "p1",
  kind: "pizza",
  category: "salgada",
  sizeId: "grande",
  flavorIds: ["calabresa", "frango-catupiry"],
  edgeId: "catupiry",
  quantity: 1,
  unitPrice: getPizzaUnitPrice("grande", "catupiry"),
};

const coca: CartItem = {
  uid: "d1",
  kind: "drink",
  productId: "coca-2l",
  name: "Coca-Cola 2L",
  quantity: 1,
  unitPrice: 15,
};

// 2) Subtotal 83 / entrega 7 / total 90 (exemplo do enunciado)
const summary = getOrderSummary([pizza, coca], 7);
check("subtotal = 83", summary.subtotal === 83, summary);
check("entrega = 7", summary.deliveryFee === 7);
check("total = 90", summary.total === 90);

// 3) Promoção: dias corretos (seg/ter/qua = 1,2,3)
check("segunda ativa", isPromotionDay(new Date("2026-10-05T12:00:00")));
check("terça ativa", isPromotionDay(new Date("2026-10-06T12:00:00")));
check("quarta ativa", isPromotionDay(new Date("2026-10-07T12:00:00")));
check("quinta inativa", !isPromotionDay(new Date("2026-10-08T12:00:00")));
check("domingo inativo", !isPromotionDay(new Date("2026-10-11T12:00:00")));

// 4) Brinde por pizza 35 cm
check("1 pizza grande elegível", countEligiblePizzas([pizza]) === 1);
const twoGrandes: CartItem[] = [pizza, { ...pizza, uid: "p2" }];
check("2 pizzas grandes -> 2 brindes", getPromoGifts(twoGrandes, true)[0]?.quantity === 2);
const brotinho: CartItem = { ...pizza, uid: "b1", sizeId: "brotinho", flavorIds: ["calabresa"], edgeId: "sem", unitPrice: 40 };
check("brotinho não gera brinde", getPromoGifts([brotinho], true).length === 0);
check("fora do dia não gera brinde", getPromoGifts([pizza], false).length === 0);
check("brinde custa 0", getPromoGifts([pizza], true)[0]?.unitPrice === 0);

// 5) Formatação
check("formatBRL 90", formatBRL(90) === "R$ 90,00", formatBRL(90));
check("formatBRL 1234.5", formatBRL(1234.5) === "R$ 1.234,50", formatBRL(1234.5));

// 6) Mensagem do WhatsApp
const customer: CheckoutCustomer = {
  name: "João Silva",
  whatsapp: "(45) 99999-9999",
  address: "Rua X",
  number: "123",
  district: "Centro",
  complement: "Casa",
  payment: "pix",
  change: "",
  notes: "Sem cebola.",
};
const gifts = getPromoGifts([pizza, coca], true);
const message = buildOrderMessage({
  items: [pizza, coca],
  gifts,
  summary,
  customer,
});

console.log("\n----- MENSAGEM -----\n" + message + "\n--------------------\n");

check("contém NOVO PEDIDO", message.includes("NOVO PEDIDO"));
check("contém cliente", message.includes("João Silva"));
check("contém sabores", message.includes("Calabresa + Frango com Catupiry"));
check("contém borda catupiry", message.includes("Borda: Catupiry — R$ 8,00"));
check("contém pizza 60", message.includes("1x Pizza 35 cm — R$ 60,00"));
check("contém coca 15", message.includes("1x Coca-Cola 2L — R$ 15,00"));
check("contém brinde grátis", message.includes("Guaraná Kuat 2L — GRÁTIS"));
check("contém subtotal 83", message.includes("*Subtotal:* R$ 83,00"));
check("contém entrega 7", message.includes("*Entrega:* R$ 7,00"));
check("contém TOTAL 90", message.includes("*TOTAL:* R$ 90,00"));
check("contém endereço", message.includes("Rua X, 123") && message.includes("Bairro: Centro"));
check("contém pagamento Pix", message.includes("*Pagamento:* Pix"));
check("contém observação", message.includes("Sem cebola."));
check("sem troco quando pix", !message.includes("Troco para"));

const cashMessage = buildOrderMessage({
  items: [pizza, coca],
  gifts: [],
  summary,
  customer: { ...customer, payment: "dinheiro", change: "R$ 100,00" },
});
check("troco aparece no dinheiro", cashMessage.includes("*Troco para:* R$ 100,00"));

const url = buildWhatsAppUrl("5545999999999", message);
check("url wa.me correta", url.startsWith("https://wa.me/5545999999999?text="));
check("url codificada", !url.includes("\n"));

// 7) Normalização de telefone (mesmo valor em qualquer formato)
const esperado = "5511999999999";
check("normaliza (11) 99999-9999", normalizePhone("(11) 99999-9999") === esperado, normalizePhone("(11) 99999-9999"));
check("normaliza 11999999999", normalizePhone("11999999999") === esperado, normalizePhone("11999999999"));
check("normaliza +55 11 99999-9999", normalizePhone("+55 11 99999-9999") === esperado, normalizePhone("+55 11 99999-9999"));
check("normaliza 5511999999999", normalizePhone("5511999999999") === esperado, normalizePhone("5511999999999"));
check("normaliza 011 99999-9999", normalizePhone("011 99999-9999") === esperado, normalizePhone("011 99999-9999"));
check("normaliza telefone da pizzaria", normalizePhone("(45) 99856-3187") === "5545998563187", normalizePhone("(45) 99856-3187"));

console.log(`\n${failures === 0 ? "TODOS OS TESTES PASSARAM" : `${failures} TESTE(S) FALHARAM`}`);
process.exit(failures === 0 ? 0 : 1);
