"use client";

import { useEffect } from "react";

import { cn } from "@/lib/cn";

export interface ToastData {
  id: number;
  message: string;
  tone?: "success" | "promo" | "info";
}

interface ToastProps {
  toast: ToastData;
  onClose: () => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 2800);
    return () => window.clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-4">
      <div
        role="status"
        className={cn(
          "anim-rise-in pointer-events-auto flex max-w-[92vw] items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-float",
          toast.tone === "promo"
            ? "bg-brand-yellow text-ink"
            : toast.tone === "info"
              ? "bg-white text-ink ring-1 ring-line"
              : "bg-ink text-white",
        )}
      >
        {toast.message}
      </div>
    </div>
  );
}
