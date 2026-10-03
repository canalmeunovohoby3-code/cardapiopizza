import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Logomarca da pizzaria"
    >
      <rect width="64" height="64" rx="16" fill="#027C3A" />
      <path
        d="M14 30C14 18 22 11 32 11s18 7 18 19L32 54Z"
        fill="#FAB230"
      />
      <path
        d="M14 30C14 18 22 11 32 11s18 7 18 19"
        fill="none"
        stroke="#E09A12"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="28" cy="26" r="3.2" fill="#F01922" />
      <circle cx="38" cy="29" r="3" fill="#F01922" />
      <circle cx="32" cy="39" r="3" fill="#F01922" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return <LogoMark className={cn("h-10 w-10", className)} />;
}
