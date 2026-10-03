"use client";

import { useState } from "react";

import { Modal } from "@/components/Modal";
import { QuantityStepper } from "@/components/QuantityStepper";
import { CheckIcon, CloseIcon, GiftIcon } from "@/components/Icons";
import { ProductArt } from "@/components/art/ProductArt";
import {
  edgeById,
  edges,
  pizzaSizeById,
  pizzaSizes,
  saltyFlavors,
  sweetFlavors,
} from "@/data/menu";
import { weekdayGiftPromotion } from "@/data/promotions";
import { cn } from "@/lib/cn";
import { formatBRL } from "@/lib/format";
import type { EdgeId, FlavorCategory, PizzaSizeId } from "@/types";

interface FlavorPickerModalProps {
  open: boolean;
  category: FlavorCategory;
  initialSizeId: PizzaSizeId;
  initialFlavorIds?: string[];
  initialEdgeId?: EdgeId;
  initialQuantity?: number;
  editing?: boolean;
  isPromoActive: boolean;
  onClose: () => void;
  onConfirm: (input: {
    sizeId: PizzaSizeId;
    flavorIds: string[];
    edgeId: EdgeId;
    quantity: number;
  }) => void;
}

export function FlavorPickerModal({
  open,
  category,
  initialSizeId,
  initialFlavorIds = [],
  initialEdgeId = "sem",
  initialQuantity = 1,
  editing = false,
  isPromoActive,
  onClose,
  onConfirm,
}: FlavorPickerModalProps) {
  const flavors = category === "salgada" ? saltyFlavors : sweetFlavors;

  const [sizeId, setSizeId] = useState<PizzaSizeId>(initialSizeId);
  const [flavorIds, setFlavorIds] = useState<string[]>(initialFlavorIds);
  const [edgeId, setEdgeId] = useState<EdgeId>(initialEdgeId);
  const [quantity, setQuantity] = useState(Math.max(1, initialQuantity));
  const [warning, setWarning] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  const size = pizzaSizeById[sizeId];
  const maxFlavors = size.maxFlavors;

  const unitPrice = size.price + edgeById[edgeId].price;
  const total = unitPrice * quantity;
  const selectedNames = flavorIds
    .map((id) => flavors.find((flavor) => flavor.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  function toggleFlavor(flavorId: string) {
    if (flavorIds.includes(flavorId)) {
      setFlavorIds(flavorIds.filter((id) => id !== flavorId));
      setWarning(null);
      return;
    }
    if (flavorIds.length >= maxFlavors) {
      setWarning(
        maxFlavors === 1
          ? "O brotinho aceita apenas 1 sabor."
          : `Você pode escolher no máximo ${maxFlavors} sabores.`,
      );
      setShakeKey((key) => key + 1);
      return;
    }
    setFlavorIds([...flavorIds, flavorId]);
    setWarning(null);
  }

  function changeSize(nextSizeId: PizzaSizeId) {
    setSizeId(nextSizeId);
    const nextMax = pizzaSizeById[nextSizeId].maxFlavors;
    if (flavorIds.length > nextMax) {
      setFlavorIds(flavorIds.slice(0, nextMax));
      setWarning(
        nextMax === 1
          ? "O brotinho aceita apenas 1 sabor. Ajustamos sua seleção."
          : `Ajustamos sua seleção para ${nextMax} sabores.`,
      );
    } else {
      setWarning(null);
    }
  }

  const canConfirm = flavorIds.length > 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel={editing ? "Editar pizza" : "Montar pizza"}
      maxWidthClass="sm:max-w-lg"
    >
      <header className="flex items-start justify-between gap-3 border-b border-line bg-white px-4 py-3.5">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-extrabold text-ink">
            {editing ? "Editar pizza" : "Monte sua pizza"}
          </h2>
          <p className="mt-0.5 text-xs text-ink-soft">
            {size.name} · {size.slices} pedaços · até {maxFlavors}{" "}
            {maxFlavors > 1 ? "sabores" : "sabor"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream-2 text-ink-soft transition active:scale-95"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
        <div>
          <p className="font-display text-sm font-bold text-ink">Escolha o tamanho</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {pizzaSizes.map((option) => {
              const active = option.id === sizeId;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => changeSize(option.id)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-2xl border p-3 text-left transition",
                    active
                      ? "border-brand-green bg-brand-green-soft"
                      : "border-line bg-white",
                  )}
                >
                  <span className="block font-display text-sm font-bold text-ink">
                    {option.shortLabel}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-ink-soft">
                    {option.slices} pedaços · {option.maxFlavors}{" "}
                    {option.maxFlavors > 1 ? "sabores" : "sabor"}
                  </span>
                  <span className="mt-1 block font-display text-base font-extrabold text-brand-green">
                    {formatBRL(option.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="font-display text-sm font-bold text-ink">Escolha sua borda</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {edges.map((edge) => {
              const active = edge.id === edgeId;
              return (
                <button
                  key={edge.id}
                  type="button"
                  onClick={() => setEdgeId(edge.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-2xl border px-3 py-2.5 text-left transition",
                    active ? "border-brand-green bg-brand-green-soft" : "border-line bg-white",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span aria-hidden="true" className="text-lg">
                      {edge.emoji}
                    </span>
                    <span className="truncate font-display text-sm font-bold text-ink">
                      {edge.shortName}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-xs font-bold",
                      edge.price > 0 ? "text-brand-green" : "text-ink-soft",
                    )}
                  >
                    {edge.price > 0 ? `+ ${formatBRL(edge.price)}` : "Grátis"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-sm font-bold text-ink">Escolha os sabores</p>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-bold",
                flavorIds.length === maxFlavors
                  ? "bg-brand-green text-white"
                  : "bg-brand-yellow-soft text-ink",
              )}
            >
              {flavorIds.length}/{maxFlavors} sabores selecionados
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-soft">
            {maxFlavors === 1
              ? "Escolha apenas 1 sabor."
              : `Você pode escolher até ${maxFlavors} sabores na mesma pizza.`}
          </p>

          <ul className="mt-2 space-y-2">
            {flavors.map((flavor) => {
              const selected = flavorIds.includes(flavor.id);
              const blocked = !selected && flavorIds.length >= maxFlavors;
              return (
                <li key={flavor.id}>
                  <button
                    type="button"
                    onClick={() => toggleFlavor(flavor.id)}
                    aria-pressed={selected}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition active:scale-[0.99]",
                      selected
                        ? "border-brand-green bg-brand-green-soft"
                        : "border-line bg-white",
                      blocked && "opacity-55",
                    )}
                  >
                    <ProductArt
                      kind="pizza"
                      id={flavor.id}
                      image={flavor.image}
                      alt={`Pizza de ${flavor.name}`}
                      sizes="64px"
                      className="h-12 w-16 shrink-0 rounded-xl"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-sm font-bold text-ink">
                        {flavor.name}
                      </span>
                      <span className="mt-0.5 line-clamp-1 block text-[11px] text-ink-soft">
                        {flavor.description}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "grid h-6 w-6 shrink-0 place-items-center rounded-full border",
                        selected
                          ? "border-brand-green bg-brand-green text-white"
                          : "border-line text-transparent",
                      )}
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {warning ? (
            <p
              key={shakeKey}
              role="alert"
              className="anim-shake mt-2 rounded-xl bg-brand-red-soft px-3 py-2 text-xs font-semibold text-brand-red-dark"
            >
              {warning}
            </p>
          ) : null}
        </div>

      </div>

      <footer className="border-t border-line bg-white px-4 pt-3 pb-safe">
        <p className="mb-2 truncate text-xs text-ink-soft">
          <span className="font-semibold text-ink">Sabores: </span>
          {selectedNames.length > 0 ? selectedNames.join(" + ") : "nenhum selecionado"}
        </p>

        {isPromoActive && sizeId === "grande" ? (
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-xl bg-brand-yellow-soft px-3 py-1.5 text-[11px] font-bold text-ink">
            <GiftIcon className="h-3.5 w-3.5" />
            Esta pizza ganha {weekdayGiftPromotion.gift.name} grátis
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-ink">Quantidade</span>
          <QuantityStepper value={quantity} onChange={setQuantity} label="Quantidade" />
        </div>

        <button
          type="button"
          disabled={!canConfirm}
          onClick={() => onConfirm({ sizeId, flavorIds, edgeId, quantity })}
          className={cn(
            "mt-3 h-12 w-full rounded-full px-4 font-display text-sm font-bold text-white transition active:scale-[0.98]",
            canConfirm ? "bg-brand-green" : "cursor-not-allowed bg-ink-soft/40",
          )}
        >
          {editing ? "Salvar alterações" : "Adicionar"} • {formatBRL(total)}
        </button>

        {!canConfirm ? (
          <p className="mt-2 text-center text-[11px] font-semibold text-ink-soft">
            Escolha pelo menos 1 sabor para continuar.
          </p>
        ) : null}
      </footer>
    </Modal>
  );
}
