export type PizzaSizeId = "grande" | "brotinho";

export type EdgeId = "sem" | "catupiry" | "cheddar" | "chocolate";

export type FlavorCategory = "salgada" | "doce";

export type DrinkGroup = "lata" | "2l";

export type Tone = "yellow" | "green" | "red";

export type PaymentMethod = "dinheiro" | "pix" | "credito" | "debito";

export interface PizzaSize {
  id: PizzaSizeId;
  name: string;
  shortLabel: string;
  slices: number;
  maxFlavors: number;
  price: number;
}

export interface Edge {
  id: EdgeId;
  name: string;
  shortName: string;
  price: number;
  emoji: string;
  tone: Tone;
}

export interface Flavor {
  id: string;
  name: string;
  description: string;
  category: FlavorCategory;
  emoji: string;
  tone: Tone;
  /** Foto real opcional (ex.: "/images/products/pizzas/pizza-calabresa.webp"). */
  image?: string;
  /** Proporção da foto (largura/altura), para o card sem faixas nem corte. */
  imageAspect?: number;
}

export interface DrinkProduct {
  id: string;
  name: string;
  shortName: string;
  price: number;
  group: DrinkGroup;
  emoji: string;
  tone: Tone;
  /** Foto real opcional (ex.: "/images/products/drinks/coca-cola-2l.webp"). */
  image?: string;
  /** Proporção da foto (largura/altura), para o card sem faixas nem corte. */
  imageAspect?: number;
}

export interface NavigationCategory {
  id: "pizzas-salgadas" | "pizzas-doces" | "refrigerantes" | "bordas";
  label: string;
  emoji: string;
}

export interface PizzaCartItem {
  uid: string;
  kind: "pizza";
  category: FlavorCategory;
  sizeId: PizzaSizeId;
  flavorIds: string[];
  edgeId: EdgeId;
  quantity: number;
  unitPrice: number;
}

export interface DrinkCartItem {
  uid: string;
  kind: "drink";
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export type CartItem = PizzaCartItem | DrinkCartItem;

export interface PromoGift {
  id: string;
  name: string;
  emoji: string;
  quantity: number;
  unitPrice: 0;
}

export interface OrderSummary {
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface CheckoutCustomer {
  name: string;
  whatsapp: string;
  address: string;
  number: string;
  district: string;
  complement: string;
  payment: PaymentMethod;
  change: string;
  notes: string;
  /** Campos extras (cadastro Supabase). Opcionais para manter compatibilidade. */
  cep?: string;
  city?: string;
  reference?: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutCustomer, string>>;

/** Cadastro do cliente salvo no Supabase (tabela `customers`, por telefone). */
export interface CustomerProfile {
  id?: string;
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  reference: string;
}
