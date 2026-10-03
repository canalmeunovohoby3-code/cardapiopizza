import { useId } from "react";

/**
 * =====================================================================
 * ARTE ILUSTRADA DAS BEBIDAS (placeholder de identidade consistente)
 * ---------------------------------------------------------------------
 * Ilustração vetorial genérica (sem logotipos ou marcas de terceiros),
 * no mesmo fundo, luz e enquadramento das pizzas. Representa apenas o
 * tipo de embalagem e a cor do refrigerante.
 * =====================================================================
 */

export interface DrinkPalette {
  body: string;
  label: string;
  cap: string;
}

export interface DrinkArtSpec {
  container: "bottle" | "can";
  palette: DrinkPalette;
}

const coca: DrinkPalette = { body: "#B11226", label: "#E63946", cap: "#C1121F" };
const cocaZero: DrinkPalette = { body: "#1C1C1C", label: "#C1121F", cap: "#111111" };
const fanta: DrinkPalette = { body: "#E8721C", label: "#F79B2E", cap: "#D9631A" };
const guarana: DrinkPalette = { body: "#046B34", label: "#0A9B4A", cap: "#035C2C" };
const pepsi: DrinkPalette = { body: "#15327A", label: "#1E4FB0", cap: "#12265E" };
const neutral: DrinkPalette = { body: "#4B5563", label: "#6B7280", cap: "#374151" };

export const drinkArtById: Record<string, DrinkArtSpec> = {
  "coca-2l": { container: "bottle", palette: coca },
  "coca-zero-2l": { container: "bottle", palette: cocaZero },
  "fanta-2l": { container: "bottle", palette: fanta },
  "guarana-2l": { container: "bottle", palette: guarana },
  "coca-lata": { container: "can", palette: coca },
  "fanta-lata": { container: "can", palette: fanta },
  "guarana-lata": { container: "can", palette: guarana },
  "pepsi-lata": { container: "can", palette: pepsi },
  default: { container: "can", palette: neutral },
};

function Bottle({ palette, shading }: { palette: DrinkPalette; shading: string }) {
  return (
    <g>
      <rect x="158" y="150" width="84" height="180" rx="18" fill={palette.body} />
      <rect x="158" y="150" width="84" height="180" rx="18" fill={shading} />
      <path d="M 171 154 L 183 106 L 217 106 L 229 154 Z" fill={palette.body} />
      <rect x="179" y="88" width="42" height="20" rx="5" fill={palette.cap} />
      <rect x="164" y="205" width="72" height="88" rx="3" fill={palette.label} />
      <rect x="164" y="205" width="72" height="88" rx="3" fill={shading} />
      <rect x="164" y="318" width="72" height="14" rx="5" fill="rgba(0,0,0,0.28)" />
      <rect x="167" y="160" width="13" height="160" rx="6.5" fill="rgba(255,255,255,0.22)" />
      <rect x="221" y="166" width="6" height="150" rx="3" fill="rgba(0,0,0,0.18)" />
    </g>
  );
}

function Can({ palette, shading }: { palette: DrinkPalette; shading: string }) {
  return (
    <g>
      <rect x="166" y="152" width="68" height="156" rx="12" fill={palette.body} />
      <rect x="166" y="152" width="68" height="156" rx="12" fill={shading} />
      <rect x="162" y="142" width="76" height="14" rx="7" fill="#C9CDD2" />
      <rect x="162" y="306" width="76" height="14" rx="7" fill="#B9BDC2" />
      <rect x="166" y="192" width="68" height="78" rx="3" fill={palette.label} />
      <rect x="166" y="192" width="68" height="78" rx="3" fill={shading} />
      <ellipse cx="200" cy="149" rx="24" ry="6" fill="rgba(0,0,0,0.18)" />
      <rect x="172" y="162" width="11" height="138" rx="5.5" fill="rgba(255,255,255,0.22)" />
      <rect x="222" y="168" width="5" height="128" rx="2.5" fill="rgba(0,0,0,0.18)" />
    </g>
  );
}

export function DrinkArt({ spec }: { spec: DrinkArtSpec }) {
  const ns = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = (name: string) => `dk-${name}-${ns}`;
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
        <linearGradient id={ref("round")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.28)" />
        </linearGradient>
        <radialGradient id={ref("vignette")} cx="50%" cy="45%" r="75%">
          <stop offset="55%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
        </radialGradient>
        <filter id={ref("blur")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      <rect width="400" height="400" fill={url("bg")} />
      <ellipse
        cx="200"
        cy="330"
        rx="90"
        ry="18"
        fill="rgba(0,0,0,0.55)"
        filter={url("blur")}
      />

      {spec.container === "bottle" ? (
        <Bottle palette={spec.palette} shading={url("round")} />
      ) : (
        <Can palette={spec.palette} shading={url("round")} />
      )}

      <rect width="400" height="400" fill={url("vignette")} />
    </svg>
  );
}
