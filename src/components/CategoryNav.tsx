"use client";

import { cn } from "@/lib/cn";
import { navigationCategories } from "@/data/menu";
import type { NavigationCategory } from "@/types";

interface CategoryNavProps {
  activeId: string;
  onSelect: (id: NavigationCategory["id"]) => void;
}

export function CategoryNav({ activeId, onSelect }: CategoryNavProps) {
  return (
    <nav
      aria-label="Categorias do cardápio"
      className="sticky top-16 z-30 border-b border-line/70 bg-cream/95 backdrop-blur"
    >
      <div className="no-scrollbar hide-scroll-x mx-auto flex max-w-5xl gap-2 px-4 py-2.5">
        {navigationCategories.map((category) => {
          const isActive = activeId === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-semibold transition",
                isActive
                  ? "border-brand-green bg-brand-green text-white shadow-sm"
                  : "border-line bg-white text-ink-soft hover:border-brand-green/40 hover:text-brand-green",
              )}
            >
              <span aria-hidden="true">{category.emoji}</span>
              {category.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
