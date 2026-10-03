import Image from "next/image";

import { DrinkArt, drinkArtById } from "@/components/art/DrinkArt";
import { PizzaArt, pizzaToppingsById } from "@/components/art/PizzaArt";
import { cn } from "@/lib/cn";

interface ProductArtProps {
  kind: "pizza" | "drink";
  /** id do sabor (pizza) ou do refrigerante (drink) */
  id: string;
  alt: string;
  /** Caminho da foto real (ex.: "/images/products/pizzas/pizza-calabresa.webp"). */
  image?: string;
  /** Tamanho real exibido, para o next/image baixar a resolução correta. */
  sizes?: string;
  /** true para a imagem acima da dobra (LCP): carrega cedo em vez de lazy. */
  priority?: boolean;
  /** Proporção largura/altura. Sem valor, usa 1:1 (padrão uniforme dos cards). */
  aspect?: number;
  className?: string;
}

/**
 * Elemento visual do produto:
 * - com foto real (`image`): usa `next/image` (AVIF/WebP, lazy, sem layout shift);
 * - sem foto: usa a arte ilustrada de identidade consistente do projeto.
 */
export function ProductArt({
  kind,
  id,
  alt,
  image,
  sizes = "(max-width: 640px) 92vw, 460px",
  priority = false,
  aspect,
  className,
}: ProductArtProps) {
  const style = { aspectRatio: String(aspect ?? 1) };

  if (image) {
    return (
      <div
        className={cn("relative overflow-hidden bg-cream-2", className)}
        style={style}
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden bg-[#241811]", className)}
      style={style}
      role="img"
      aria-label={alt}
    >
      {kind === "pizza" ? (
        <PizzaArt toppings={pizzaToppingsById[id] ?? pizzaToppingsById.default} />
      ) : (
        <DrinkArt spec={drinkArtById[id] ?? drinkArtById.default} />
      )}
    </div>
  );
}
