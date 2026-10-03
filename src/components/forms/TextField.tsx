"use client";

import type { ChangeEvent, Ref } from "react";

import { cn } from "@/lib/cn";

export interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "decimal";
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  textarea?: boolean;
  className?: string;
  inputRef?: Ref<HTMLInputElement>;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required,
  type = "text",
  inputMode,
  placeholder,
  autoComplete,
  maxLength,
  textarea,
  className,
  inputRef,
}: TextFieldProps) {
  const fieldClass = cn(
    "mt-1 w-full rounded-2xl border bg-white px-3.5 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-brand-green",
    error ? "border-brand-red" : "border-line",
  );

  return (
    <div className={className}>
      <label htmlFor={id} className="text-xs font-semibold text-ink">
        {label}
        {required ? <span className="text-brand-red"> *</span> : null}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={3}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(fieldClass, "resize-none")}
        />
      ) : (
        <input
          ref={inputRef}
          id={id}
          name={id}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={fieldClass}
        />
      )}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-[11px] font-semibold text-brand-red"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-[11px] text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
