import { drinkImages, productImages } from "@/data/generated-images";
import type {
  DrinkProduct,
  Edge,
  Flavor,
  NavigationCategory,
  PizzaSize,
} from "@/types";

/**
 * =====================================================================
 * DADOS DO CARDÁPIO
 * ---------------------------------------------------------------------
 * Preços, sabores, tamanhos, bordas e bebidas ficam centralizados aqui.
 * Para alterar um preço ou adicionar um sabor, edite apenas este arquivo.
 *
 * FOTOS DOS PRODUTOS:
 * - Sem foto, o card usa a arte ilustrada de identidade consistente
 *   (src/components/art/), que não se passa por fotografia real.
 * - Para usar a foto real, coloque o arquivo em image-sources/pizzas/
 *   (nome = id do sabor; ex.: costela.jpg) e rode `npm run optimize:images`.
 *   O caminho é ligado automaticamente por src/data/generated-images.ts.
 *   Veja o guia em public/images/products/README.md.
 * =====================================================================
 */

export const pizzaSizes: PizzaSize[] = [
  {
    id: "grande",
    name: "Pizza 35 cm",
    shortLabel: "35 cm",
    slices: 12,
    maxFlavors: 3,
    price: 60,
  },
  {
    id: "brotinho",
    name: "Pizza 25 cm Brotinho",
    shortLabel: "Brotinho 25 cm",
    slices: 4,
    maxFlavors: 1,
    price: 40,
  },
];

export const edges: Edge[] = [
  { id: "sem", name: "Sem borda", shortName: "Sem borda", price: 0, emoji: "🚫", tone: "green" },
  { id: "catupiry", name: "Borda de Catupiry", shortName: "Catupiry", price: 8, emoji: "🧀", tone: "yellow" },
  { id: "cheddar", name: "Borda de Cheddar", shortName: "Cheddar", price: 8, emoji: "🧈", tone: "yellow" },
  { id: "chocolate", name: "Borda de Chocolate", shortName: "Chocolate", price: 10, emoji: "🍫", tone: "red" },
];

const saltyFlavorsRaw: Flavor[] = [
  {
    id: "calabresa",
    name: "Calabresa",
    description: "Molho de tomate, queijo mussarela, calabresa, cebola e orégano.",
    category: "salgada",
    emoji: "🍕",
    tone: "red",
  },
  {
    id: "frango-catupiry",
    name: "Frango com Catupiry",
    description: "Molho de tomate, queijo mussarela, frango, catupiry e orégano.",
    category: "salgada",
    emoji: "🍗",
    tone: "yellow",
  },
  {
    id: "portuguesa",
    name: "Portuguesa",
    description:
      "Molho de tomate, queijo mussarela, presunto, cebola, ovo, ervilha, azeitona e orégano.",
    category: "salgada",
    emoji: "🥘",
    tone: "green",
  },
  {
    id: "quatro-queijos",
    name: "Quatro Queijos",
    description:
      "Molho de tomate, queijo mussarela, provolone, parmesão, requeijão e orégano.",
    category: "salgada",
    emoji: "🧀",
    tone: "yellow",
  },
  {
    id: "lombo-catupiry",
    name: "Lombo com Catupiry",
    description: "Molho de tomate, queijo mussarela, lombo, catupiry e orégano.",
    category: "salgada",
    emoji: "🍖",
    tone: "red",
  },
  {
    id: "cheddar-bacon",
    name: "Cheddar e Bacon",
    description: "Molho de tomate, queijo mussarela, cheddar, cubos de bacon e orégano.",
    category: "salgada",
    emoji: "🥓",
    tone: "red",
  },
  {
    id: "mussarela",
    name: "Mussarela",
    description: "Molho de tomate, queijo mussarela e orégano.",
    category: "salgada",
    emoji: "🍕",
    tone: "yellow",
  },
  {
    id: "tradicional",
    name: "Tradicional",
    description: "Molho de tomate, queijo mussarela, presunto, tomate e orégano.",
    category: "salgada",
    emoji: "🍅",
    tone: "red",
  },
  {
    id: "costela",
    name: "Costela",
    description:
      "Molho de tomate, costela desfiada, queijo mussarela, azeitona, cebola e orégano.",
    category: "salgada",
    emoji: "🍖",
    tone: "green",
  },
];

const sweetFlavorsRaw: Flavor[] = [
  {
    id: "chocolate",
    name: "Chocolate",
    description: "Massa tradicional, creme de leite e chocolate preto.",
    category: "doce",
    emoji: "🍫",
    tone: "red",
  },
  {
    id: "prestigio",
    name: "Prestígio",
    description: "Massa tradicional, creme de leite, chocolate preto e coco ralado.",
    category: "doce",
    emoji: "🥥",
    tone: "yellow",
  },
  {
    id: "dois-amores",
    name: "Dois Amores",
    description: "Massa tradicional, creme de leite, chocolate preto e chocolate branco.",
    category: "doce",
    emoji: "🍫",
    tone: "green",
  },
];

const drinks2LRaw: DrinkProduct[] = [
  { id: "coca-2l", name: "Coca-Cola 2L", shortName: "Coca-Cola", price: 15, group: "2l", emoji: "🥤", tone: "red" },
  { id: "coca-zero-2l", name: "Coca-Cola Zero 2L", shortName: "Coca Zero", price: 15, group: "2l", emoji: "🥤", tone: "red" },
  { id: "fanta-2l", name: "Fanta 2L", shortName: "Fanta", price: 14, group: "2l", emoji: "🍊", tone: "yellow" },
  { id: "guarana-2l", name: "Guaraná 2L", shortName: "Guaraná", price: 14, group: "2l", emoji: "🥤", tone: "green" },
];

const drinksLataRaw: DrinkProduct[] = [
  { id: "coca-lata", name: "Coca-Cola Lata", shortName: "Coca-Cola", price: 5, group: "lata", emoji: "🥫", tone: "red" },
  { id: "fanta-lata", name: "Fanta Lata", shortName: "Fanta", price: 5, group: "lata", emoji: "🥫", tone: "yellow" },
  { id: "guarana-lata", name: "Guaraná Lata", shortName: "Guaraná", price: 5, group: "lata", emoji: "🥫", tone: "green" },
  { id: "pepsi-lata", name: "Pepsi Lata", shortName: "Pepsi", price: 5, group: "lata", emoji: "🥫", tone: "red" },
];

/**
 * Anexa a foto real (quando existir) a cada produto, pelo id.
 * Os caminhos vêm do manifesto gerado por `npm run optimize:images`.
 */
function withImages<T extends { id: string; image?: string; imageAspect?: number }>(
  items: T[],
  images: Record<string, { src: string; width: number; height: number }>,
): T[] {
  return items.map((item) => {
    const image = images[item.id];
    if (!image) return item;
    return {
      ...item,
      image: image.src,
      imageAspect: image.width / image.height,
    };
  });
}

export const saltyFlavors = withImages(saltyFlavorsRaw, productImages);
export const sweetFlavors = withImages(sweetFlavorsRaw, productImages);
export const drinks2L = withImages(drinks2LRaw, drinkImages);
export const drinksLata = withImages(drinksLataRaw, drinkImages);

export const navigationCategories: NavigationCategory[] = [
  { id: "pizzas-salgadas", label: "Pizzas Salgadas", emoji: "🍕" },
  { id: "pizzas-doces", label: "Pizzas Doces", emoji: "🍫" },
  { id: "refrigerantes", label: "Refrigerantes", emoji: "🥤" },
  { id: "bordas", label: "Bordas", emoji: "🧀" },
];

export const pizzaSectionNote = "Todas as pizzas acompanham azeitona.";

/** Todos os sabores em um único mapa, para consultas por id. */
export const flavorsById: Record<string, Flavor> = Object.fromEntries(
  [...saltyFlavors, ...sweetFlavors].map((flavor) => [flavor.id, flavor]),
);

export const pizzaSizeById = Object.fromEntries(
  pizzaSizes.map((size) => [size.id, size]),
) as Record<PizzaSize["id"], PizzaSize>;

export const edgeById = Object.fromEntries(
  edges.map((edge) => [edge.id, edge]),
) as Record<Edge["id"], Edge>;

export const drinkById: Record<string, DrinkProduct> = Object.fromEntries(
  [...drinks2L, ...drinksLata].map((drink) => [drink.id, drink]),
);
