"use client";

import { ProductArt } from "@/components/art/ProductArt";
import { QuantityStepper } from "@/components/QuantityStepper";
import { PencilIcon, TrashIcon } from "@/components/Icons";
import { drinkById, edgeById, flavorsById, pizzaSizeById } from "@/data/menu";
import { formatBRL } from "@/lib/format";
import { describeItem } from "@/lib/order";
import type { CartItem, PizzaCartItem } from "@/types";

interface CartItemRowProps {
  item: CartItem;
  onChangeQuantity: (uid: string, quantity: number) => void;
  onRemove: (uid: string) => void;
  onEdit: (item: PizzaCartItem) => void;
}

export function CartItemRow({
  item,
  onChangeQuantity,
  onRemove,
  onEdit,
}: CartItemRowProps) {
  const described = describeItem(item);

  const meta =
    item.kind === "pizza"
      ? `${pizzaSizeById[item.sizeId].shortLabel} · ${pizzaSizeById[item.sizeId].slices} pedaços`
      : "Refrigerante";

  const edgeName =
    item.kind === "pizza" ? edgeById[item.edgeId].shortName : null;

  const image =
    item.kind === "drink"
      ? drinkById[item.productId]?.image
      : flavorsById[item.flavorIds[0]]?.image;

  return (
    <li className="flex gap-3 py-3">
      <ProductArt
        kind={item.kind === "drink" ? "drink" : "pizza"}
        id={item.kind === "drink" ? item.productId : item.flavorIds[0]}
        image={image}
        alt={described.title}
        sizes="96px"
        className={
          item.kind === "pizza"
            ? "h-16 w-24 shrink-0 rounded-2xl"
            : "h-16 w-16 shrink-0 rounded-2xl"
        }
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-sm font-bold leading-snug text-ink">
            {described.title}
          </p>
          <p className="shrink-0 font-display text-sm font-extrabold text-ink">
            {formatBRL(described.total)}
          </p>
        </div>

        <p className="text-[11px] text-ink-soft">{meta}</p>
        {described.flavorLine ? (
          <p className="mt-0.5 text-[11px] text-ink-soft">
            <span className="font-semibold text-ink">Sabores:</span>{" "}
            {described.flavorLine}
          </p>
        ) : null}
        {edgeName && described.edgeLine ? (
          <p className="text-[11px] text-ink-soft">
            <span className="font-semibold text-ink">Borda:</span> {edgeName} ·{" "}
            {described.edgeLine}
          </p>
        ) : null}
        <p className="mt-0.5 text-[11px] text-ink-soft">
          {formatBRL(item.unitPrice)} cada
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            onChange={(quantity) => onChangeQuantity(item.uid, quantity)}
            label={`Quantidade de ${described.title}`}
          />
          <div className="flex gap-1">
            {item.kind === "pizza" ? (
              <button
                type="button"
                onClick={() => onEdit(item)}
                aria-label={`Editar ${described.title}`}
                className="grid h-9 w-9 place-items-center rounded-full bg-cream-2 text-ink-soft transition active:scale-95"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => onRemove(item.uid)}
              aria-label={`Remover ${described.title}`}
              className="grid h-9 w-9 place-items-center rounded-full bg-brand-red-soft text-brand-red transition active:scale-95"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
