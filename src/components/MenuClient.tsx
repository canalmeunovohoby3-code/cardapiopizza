"use client";

import { useCallback, useEffect, useState } from "react";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryNav } from "@/components/CategoryNav";
import { PromoBanner } from "@/components/PromoBanner";
import { CombosSection } from "@/components/CombosSection";
import { PizzaSection } from "@/components/PizzaSection";
import { DrinksSection } from "@/components/DrinksSection";
import { EdgesSection } from "@/components/EdgesSection";
import { DeliveryInfo } from "@/components/DeliveryInfo";
import { Footer } from "@/components/Footer";
import { CartBar } from "@/components/CartBar";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { FlavorPickerModal } from "@/components/FlavorPickerModal";
import { Toast, type ToastData } from "@/components/Toast";
import { useCart } from "@/context/CartContext";
import { comboById, pizzaSectionNote, saltyFlavors, sweetFlavors } from "@/data/menu";
import { weekdayGiftPromotion } from "@/data/promotions";
import type {
  CartItem,
  ComboProduct,
  DrinkProduct,
  EdgeId,
  FlavorCategory,
  NavigationCategory,
  PizzaSizeId,
} from "@/types";

interface FlavorModalState {
  sessionId: number;
  mode: "pizza" | "combo";
  category: FlavorCategory;
  sizeId: PizzaSizeId;
  flavorIds: string[];
  edgeId: EdgeId;
  quantity: number;
  editingUid?: string;
  comboId?: string;
}

export function MenuClient() {
  const {
    itemCount,
    summary,
    gifts,
    isPromoActive,
    hydrated,
    addPizza,
    editPizza,
    addDrink,
    addCombo,
    editCombo,
  } = useCart();

  const [activeCategory, setActiveCategory] =
    useState<NavigationCategory["id"]>("pizzas-salgadas");
  const [modal, setModal] = useState<FlavorModalState | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback(
    (message: string, tone: ToastData["tone"] = "success") => {
      setToast({ id: Date.now(), message, tone });
    },
    [],
  );

  useEffect(() => {
    const ids: NavigationCategory["id"][] = [
      "combos",
      "pizzas-salgadas",
      "pizzas-doces",
      "refrigerantes",
      "bordas",
    ];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) {
          setActiveCategory(visible[0].target.id as NavigationCategory["id"]);
        }
      },
      { rootMargin: "-150px 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleCategorySelect = useCallback((id: NavigationCategory["id"]) => {
    setActiveCategory(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openFlavorModal = useCallback(
    (category: FlavorCategory, sizeId: PizzaSizeId, flavorId?: string) => {
      setModal({
        sessionId: Date.now(),
        mode: "pizza",
        category,
        sizeId,
        flavorIds: flavorId ? [flavorId] : [],
        edgeId: "sem",
        quantity: 1,
      });
    },
    [],
  );

  const openComboModal = useCallback((combo: ComboProduct) => {
    setModal({
      sessionId: Date.now(),
      mode: "combo",
      comboId: combo.id,
      category: "salgada",
      sizeId: "grande",
      flavorIds: [],
      edgeId: "sem",
      quantity: 1,
    });
  }, []);

  const handleConfirmFlavor = useCallback(
    (input: {
      sizeId: PizzaSizeId;
      flavorIds: string[];
      edgeId: EdgeId;
      quantity: number;
    }) => {
      if (!modal) return;

      if (modal.mode === "combo" && modal.comboId) {
        const combo = comboById[modal.comboId];
        if (!combo) {
          setModal(null);
          return;
        }
        if (modal.editingUid) {
          editCombo(modal.editingUid, {
            flavorIds: input.flavorIds,
            quantity: input.quantity,
          });
          setModal(null);
          setCartOpen(true);
          showToast("Combo atualizado", "success");
          return;
        }
        addCombo({
          comboId: combo.id,
          name: combo.name,
          price: combo.price,
          includes: combo.includes,
          flavorIds: input.flavorIds,
          quantity: input.quantity,
        });
        setModal(null);
        showToast("Combo adicionado ao carrinho", "success");
        return;
      }

      if (modal.editingUid) {
        editPizza(modal.editingUid, input);
        setModal(null);
        setCartOpen(true);
        showToast("Pizza atualizada", "success");
        return;
      }

      const earnsGift = isPromoActive && input.sizeId === "grande";
      addPizza({ category: modal.category, ...input });
      setModal(null);
      showToast(
        earnsGift
          ? `🎁 Você ganhou um ${weekdayGiftPromotion.gift.name}!`
          : "Adicionado ao carrinho",
        earnsGift ? "promo" : "success",
      );
    },
    [modal, editPizza, editCombo, addPizza, addCombo, isPromoActive, showToast],
  );

  const handleAddDrink = useCallback(
    (drink: DrinkProduct) => {
      addDrink(drink, 1);
      showToast(`${drink.shortName} adicionado`, "success");
    },
    [addDrink, showToast],
  );

  const handleEditItem = useCallback((item: CartItem) => {
    setCartOpen(false);

    if (item.kind === "combo") {
      setModal({
        sessionId: Date.now(),
        mode: "combo",
        comboId: item.comboId,
        category: "salgada",
        sizeId: "grande",
        flavorIds: item.flavorIds,
        edgeId: "sem",
        quantity: item.quantity,
        editingUid: item.uid,
      });
      return;
    }

    if (item.kind === "pizza") {
      setModal({
        sessionId: Date.now(),
        mode: "pizza",
        category: item.category,
        sizeId: item.sizeId,
        flavorIds: item.flavorIds,
        edgeId: item.edgeId,
        quantity: item.quantity,
        editingUid: item.uid,
      });
    }
  }, []);

  const showCartBar = hydrated && itemCount > 0;

  return (
    <>
      <Header />
      <CategoryNav activeId={activeCategory} onSelect={handleCategorySelect} />

      <main className="pb-28">
        <Hero />
        {/* A promoção só entra no cardápio nos dias permitidos (seg/ter/qua). */}
        {isPromoActive ? <PromoBanner /> : null}

        <div id="cardapio" className="scroll-mt-36">
          <CombosSection onSelect={openComboModal} />
          <PizzaSection
            id="pizzas-salgadas"
            title="Pizzas Salgadas"
            emoji="🍕"
            category="salgada"
            flavors={saltyFlavors}
            note={pizzaSectionNote}
            isPromoActive={isPromoActive}
            priorityFirst
            onSelectFlavor={openFlavorModal}
            onSelectSize={(category, sizeId) => openFlavorModal(category, sizeId)}
          />
          <PizzaSection
            id="pizzas-doces"
            title="Pizzas Doces"
            emoji="🍫"
            category="doce"
            flavors={sweetFlavors}
            note="Massa tradicional com creme de leite. Escolha 1 sabor no brotinho ou até 3 na pizza de 35 cm."
            isPromoActive={isPromoActive}
            onSelectFlavor={openFlavorModal}
            onSelectSize={(category, sizeId) => openFlavorModal(category, sizeId)}
          />
          <DrinksSection onAdd={handleAddDrink} />
          <EdgesSection />
        </div>

        <DeliveryInfo />
      </main>

      <Footer reserveCartSpace={showCartBar} />

      {showCartBar ? (
        <CartBar
          itemCount={itemCount}
          total={summary.total}
          hasGift={gifts.length > 0}
          onOpen={() => setCartOpen(true)}
        />
      ) : null}

      {modal ? (
        <FlavorPickerModal
          key={modal.sessionId}
          open
          mode={modal.mode}
          comboName={modal.comboId ? comboById[modal.comboId]?.name : undefined}
          comboIncludes={modal.comboId ? comboById[modal.comboId]?.includes : undefined}
          comboPrice={modal.comboId ? comboById[modal.comboId]?.price : undefined}
          category={modal.category}
          initialSizeId={modal.sizeId}
          initialFlavorIds={modal.flavorIds}
          initialEdgeId={modal.edgeId}
          initialQuantity={modal.quantity}
          editing={Boolean(modal.editingUid)}
          isPromoActive={isPromoActive}
          onClose={() => setModal(null)}
          onConfirm={handleConfirmFlavor}
        />
      ) : null}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onEdit={handleEditItem}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {checkoutOpen ? (
        <CheckoutModal onClose={() => setCheckoutOpen(false)} />
      ) : null}

      {toast ? <Toast toast={toast} onClose={() => setToast(null)} /> : null}
    </>
  );
}
