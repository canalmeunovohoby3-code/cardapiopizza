"use client";

import { cn } from "@/lib/cn";
import { MinusIcon, PlusIcon } from "@/components/Icons";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantidade",
  size = "md",
  className,
}: QuantityStepperProps) {
  const buttonSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line bg-white p-1",
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Diminuir quantidade"
        className={cn(
          "grid place-items-center rounded-full text-brand-green transition active:scale-95 disabled:opacity-35",
          "hover:bg-brand-green-soft disabled:hover:bg-transparent",
          buttonSize,
        )}
      >
        <MinusIcon className={iconSize} />
      </button>
      <span
        className={cn(
          "min-w-7 text-center font-display font-bold tabular-nums",
          size === "sm" ? "text-base" : "text-lg",
        )}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Aumentar quantidade"
        className={cn(
          "grid place-items-center rounded-full bg-brand-green text-white transition active:scale-95 disabled:opacity-40",
          buttonSize,
        )}
      >
        <PlusIcon className={iconSize} />
      </button>
    </div>
  );
}
