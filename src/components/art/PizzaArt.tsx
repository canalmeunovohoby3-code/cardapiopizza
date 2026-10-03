import { useId, type ReactNode } from "react";

/**
 * =====================================================================
 * ARTE ILUSTRADA DAS PIZZAS (placeholder de identidade consistente)
 * ---------------------------------------------------------------------
 * Esta NÃO é uma foto: é uma ilustração vetorial criada para o projeto.
 * Todas as pizzas usam a MESMA direção de arte (fundo, ângulo, luz,
 * proporção e enquadramento), então o cardápio fica coerente mesmo sem
 * as fotos reais. Quando houver foto, basta preencher o campo `image`
 * no dado do produto (ver src/data/menu.ts).
 * =====================================================================
 */

export type ToppingType =
  | "pepperoni"
  | "onion"
  | "chicken"
  | "catupiry"
  | "ham"
  | "egg"
  | "pea"
  | "olive"
  | "cheeseWedge"
  | "shred"
  | "lombo"
  | "bacon"
  | "cheddar"
  | "tomato"
  | "costela"
  | "chocoHalf"
  | "whiteHalf"
  | "coconut";

export interface ToppingLayer {
  type: ToppingType;
  count: number;
}

/** Ingredientes que a arte desenha em cada sabor (nunca altera o sabor). */
export const pizzaToppingsById: Record<string, ToppingLayer[]> = {
  calabresa: [
    { type: "pepperoni", count: 7 },
    { type: "onion", count: 5 },
    { type: "olive", count: 3 },
  ],
  "frango-catupiry": [
    { type: "chicken", count: 8 },
    { type: "catupiry", count: 6 },
    { type: "olive", count: 3 },
  ],
  portuguesa: [
    { type: "ham", count: 5 },
    { type: "egg", count: 4 },
    { type: "onion", count: 4 },
    { type: "pea", count: 7 },
    { type: "olive", count: 3 },
  ],
  "quatro-queijos": [
    { type: "cheeseWedge", count: 7 },
    { type: "catupiry", count: 4 },
    { type: "shred", count: 12 },
    { type: "olive", count: 3 },
  ],
  "lombo-catupiry": [
    { type: "lombo", count: 7 },
    { type: "catupiry", count: 6 },
    { type: "olive", count: 3 },
  ],
  "cheddar-bacon": [
    { type: "bacon", count: 8 },
    { type: "cheddar", count: 1 },
    { type: "olive", count: 3 },
  ],
  mussarela: [
    { type: "cheeseWedge", count: 5 },
    { type: "shred", count: 10 },
    { type: "olive", count: 4 },
  ],
  tradicional: [
    { type: "ham", count: 5 },
    { type: "tomato", count: 5 },
    { type: "olive", count: 3 },
  ],
  costela: [
    { type: "costela", count: 8 },
    { type: "onion", count: 4 },
    { type: "olive", count: 3 },
  ],
  chocolate: [{ type: "chocoHalf", count: 1 }, { type: "coconut", count: 5 }],
  prestigio: [{ type: "chocoHalf", count: 1 }, { type: "coconut", count: 16 }],
  "dois-amores": [
    { type: "chocoHalf", count: 1 },
    { type: "whiteHalf", count: 1 },
  ],
  default: [{ type: "shred", count: 10 }, { type: "olive", count: 3 }],
};

const CX = 200;
const CY = 200;
const CRUST_RX = 152;
const CRUST_RY = 130;
const RATIO = CRUST_RY / CRUST_RX;
const CHEESE_RX = 128;
const CHEESE_RY = 109;
const TOP_R = 110;

/** Posições fixas (mesma composição para todas as pizzas). */
const SPOTS: Array<[number, number]> = [
  [0, 0],
  [0.55, -0.28],
  [-0.52, -0.3],
  [0.3, 0.55],
  [-0.33, 0.52],
  [0.8, 0.18],
  [-0.78, 0.16],
  [0.2, -0.72],
  [-0.22, -0.7],
  [0.6, -0.62],
  [-0.58, -0.6],
  [0.66, 0.62],
  [-0.64, 0.6],
  [0.88, -0.08],
  [-0.9, -0.05],
  [0.08, 0.82],
  [-0.1, 0.84],
  [0.44, 0.14],
];

function scaleFor(index: number, layer: number): number {
  return 0.92 + ((index * 3 + layer) % 4) * 0.05;
}

function rotationFor(index: number, layer: number): number {
  return (index * 47 + layer * 23) % 360;
}

function renderTopping(
  type: ToppingType,
  x: number,
  y: number,
  scale: number,
  rotation: number,
  key: string,
  shade: string,
): ReactNode {
  const transform = `translate(${x} ${y}) rotate(${rotation}) scale(${scale})`;
  const shadeFill = `url(#${shade})`;

  switch (type) {
    case "pepperoni":
      return (
        <g key={key} transform={transform}>
          <circle r="15" fill="#B0332B" />
          <circle r="15" fill={shadeFill} />
          <circle cx="-4" cy="-3" r="1.8" fill="#7E1F19" />
          <circle cx="4" cy="2" r="1.6" fill="#7E1F19" />
          <circle cx="0" cy="-6" r="1.4" fill="#7E1F19" />
        </g>
      );
    case "onion":
      return (
        <g key={key} transform={transform} fill="none" strokeLinecap="round">
          <path d="M -13 0 a 13 13 0 0 1 13 -13" stroke="#EDDCEF" strokeWidth="4" />
          <path d="M -8 4 a 9 9 0 0 1 9 -9" stroke="#D6BBDC" strokeWidth="3" />
        </g>
      );
    case "chicken":
      return (
        <g key={key} transform={transform}>
          <ellipse rx="14" ry="11" fill="#E7C27D" />
          <ellipse rx="14" ry="11" fill={shadeFill} />
          <path
            d="M -8 -3 q 4 -4 8 0 M -6 4 q 4 3 8 0"
            stroke="#C79B54"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );
    case "catupiry":
      return (
        <g key={key} transform={transform}>
          <ellipse rx="12" ry="9" fill="#FFFDF6" />
          <path d="M -7 0 q 4 -5 8 0 q -4 4 -8 0" fill="#EFE6D3" />
        </g>
      );
    case "ham":
      return (
        <g key={key} transform={transform}>
          <rect x="-13" y="-9" width="26" height="18" rx="7" fill="#E9A0A0" />
          <path d="M -8 -3 h 16 M -8 3 h 16" stroke="#D77F7F" strokeWidth="2" />
        </g>
      );
    case "egg":
      return (
        <g key={key} transform={transform}>
          <ellipse rx="13" ry="10" fill="#FBFBF6" />
          <circle r="5.5" fill="#F2B33D" />
          <circle r="5.5" fill={shadeFill} />
        </g>
      );
    case "pea":
      return (
        <g key={key} transform={transform}>
          <circle r="5" fill="#7FB069" />
          <circle r="5" fill={shadeFill} />
        </g>
      );
    case "olive":
      return (
        <g key={key} transform={transform}>
          <circle r="7" fill="#3E3126" />
          <circle r="7" fill={shadeFill} />
          <circle r="2.6" fill="#C0392B" />
        </g>
      );
    case "cheeseWedge":
      return (
        <g key={key} transform={transform}>
          <path
            d="M -11 -7 L 11 -4 L -3 10 Z"
            fill="#F3C64B"
            stroke="#D9A72F"
            strokeWidth="1.5"
          />
        </g>
      );
    case "shred":
      return (
        <g key={key} transform={transform}>
          <path
            d="M -10 0 q 3 -3 6 0 q 3 3 6 0"
            fill="none"
            stroke="#F6D57A"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      );
    case "lombo":
      return (
        <g key={key} transform={transform}>
          <rect x="-13" y="-7" width="26" height="14" rx="7" fill="#DE9A9A" />
          <path d="M -9 -2 h 18 M -9 3 h 18" stroke="#C47676" strokeWidth="2" />
        </g>
      );
    case "bacon":
      return (
        <g key={key} transform={transform}>
          <rect x="-10" y="-7" width="20" height="14" rx="5" fill="#A63E2C" />
          <path d="M -7 -2 h 14 M -7 3 h 14" stroke="#E8BFA8" strokeWidth="2.5" />
        </g>
      );
    case "tomato":
      return (
        <g key={key} transform={transform}>
          <circle r="11" fill="#D9483B" />
          <circle r="11" fill={shadeFill} />
          <circle r="7" fill="#E9675A" />
          <path d="M 0 -4 l 2 3 -2 3 -2 -3 Z" fill="#F2C94C" />
        </g>
      );
    case "costela":
      return (
        <g key={key} transform={transform}>
          <path
            d="M -12 -3 q 4 -5 8 -1 q 4 4 8 -1"
            stroke="#7A4A2B"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M -10 5 q 4 -4 8 0 q 4 3 8 -1"
            stroke="#8C5733"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );
    case "cheddar":
      return (
        <g key={key} fill="none" stroke="#F0A03C" strokeWidth="9" strokeLinecap="round">
          <path d="M -108 -34 Q -72 4 -36 -34 T 36 -34 T 108 -34" />
          <path d="M -108 34 Q -72 72 -36 34 T 36 34 T 108 34" />
        </g>
      );
    case "chocoHalf":
      return (
        <g key={key} fill="none" stroke="#4A2C1A" strokeWidth="9" strokeLinecap="round">
          <path d="M -100 -22 Q -62 8 -24 -22" />
          <path d="M -100 22 Q -62 52 -24 22" />
          <path d="M -76 -58 Q -46 -28 -16 -58" />
        </g>
      );
    case "whiteHalf":
      return (
        <g key={key} fill="none" stroke="#F4E9D6" strokeWidth="9" strokeLinecap="round">
          <path d="M 24 -22 Q 62 8 100 -22" />
          <path d="M 24 22 Q 62 52 100 22" />
          <path d="M 16 -58 Q 46 -28 76 -58" />
        </g>
      );
    case "coconut":
    default:
      return (
        <g key={key} transform={transform}>
          <rect
            x="-7"
            y="-3"
            width="14"
            height="6"
            rx="3"
            fill="#FFFDF6"
            stroke="#E5D9C6"
            strokeWidth="1"
          />
        </g>
      );
  }
}

function renderLayer(
  layer: ToppingLayer,
  layerIndex: number,
  shade: string,
): ReactNode[] {
  if (layer.type === "cheddar" || layer.type === "chocoHalf" || layer.type === "whiteHalf") {
    return [renderTopping(layer.type, 0, 0, 1, 0, `${layer.type}-0`, shade)];
  }

  const nodes: ReactNode[] = [];
  const offset = layerIndex * 5;
  for (let i = 0; i < layer.count; i += 1) {
    const spot = SPOTS[(offset + i) % SPOTS.length];
    nodes.push(
      renderTopping(
        layer.type,
        Math.round(spot[0] * TOP_R),
        Math.round(spot[1] * TOP_R),
        scaleFor(i, layerIndex),
        rotationFor(i, layerIndex),
        `${layer.type}-${i}`,
        shade,
      ),
    );
  }
  return nodes;
}

export function PizzaArt({ toppings }: { toppings: ToppingLayer[] }) {
  const ns = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = (name: string) => `pz-${name}-${ns}`;
  const url = (name: string) => `url(#${ref(name)})`;

  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={ref("bg")} cx="32%" cy="22%" r="85%">
          <stop offset="0%" stopColor="#46321f" />
          <stop offset="55%" stopColor="#2c1e14" />
          <stop offset="100%" stopColor="#1c1209" />
        </radialGradient>
        <linearGradient id={ref("crust")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFC170" />
          <stop offset="55%" stopColor="#DDA04A" />
          <stop offset="100%" stopColor="#BC7C2C" />
        </linearGradient>
        <radialGradient id={ref("cheese")} cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#FDEBBB" />
          <stop offset="70%" stopColor="#F6D487" />
          <stop offset="100%" stopColor="#E9BC63" />
        </radialGradient>
        <radialGradient id={ref("shade")} cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
        </radialGradient>
        <radialGradient id={ref("light")} cx="30%" cy="24%" r="70%">
          <stop offset="0%" stopColor="rgba(255,240,205,0.55)" />
          <stop offset="100%" stopColor="rgba(255,240,205,0)" />
        </radialGradient>
        <radialGradient id={ref("vignette")} cx="50%" cy="45%" r="75%">
          <stop offset="60%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
        </radialGradient>
        <filter id={ref("blur")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      <rect width="400" height="400" fill={url("bg")} />

      {/* sombra de contato (mesma para todas as pizzas) */}
      <ellipse
        cx={CX}
        cy={338}
        rx={138}
        ry={20}
        fill="rgba(0,0,0,0.55)"
        filter={url("blur")}
      />

      {/* massa */}
      <ellipse cx={CX} cy={CY} rx={CRUST_RX} ry={CRUST_RY} fill={url("crust")} />
      <ellipse
        cx={CX}
        cy={CY}
        rx={CRUST_RX}
        ry={CRUST_RY}
        fill="none"
        stroke="#A96A22"
        strokeWidth="4"
      />
      {/* bolhas da borda */}
      <ellipse cx={CX} cy={CY - CRUST_RY + 16} rx="20" ry="9" fill="rgba(255,240,200,0.28)" />
      <ellipse cx={CX - 78} cy={CY - 78} rx="16" ry="8" fill="rgba(255,240,200,0.22)" />
      <ellipse cx={CX + 84} cy={CY - 62} rx="15" ry="7" fill="rgba(255,240,200,0.22)" />

      {/* molho e queijo */}
      <ellipse cx={CX} cy={CY} rx={CHEESE_RX} ry={CHEESE_RY} fill={url("cheese")} />
      <ellipse cx={CX} cy={CY} rx={CHEESE_RX} ry={CHEESE_RY} fill={url("vignette")} />
      {/* manchas de forno */}
      <ellipse cx={CX - 46} cy={CY + 34} rx="26" ry="16" fill="rgba(170,110,40,0.18)" />
      <ellipse cx={CX + 58} cy={CY - 18} rx="22" ry="14" fill="rgba(170,110,40,0.16)" />
      <ellipse cx={CX + 12} cy={CY + 62} rx="18" ry="11" fill="rgba(170,110,40,0.14)" />

      {/* ingredientes (com a mesma perspectiva da pizza) */}
      <g transform={`translate(${CX} ${CY}) scale(1 ${RATIO})`}>
        {toppings.flatMap((layer, layerIndex) =>
          renderLayer(layer, layerIndex, ref("shade")),
        )}
      </g>

      {/* luz de estúdio */}
      <ellipse cx={CX} cy={CY} rx={CRUST_RX} ry={CRUST_RY} fill={url("light")} />
    </svg>
  );
}
