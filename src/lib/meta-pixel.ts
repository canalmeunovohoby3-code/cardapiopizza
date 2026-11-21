/**
 * Meta Pixel (Facebook).
 *
 * O ID padrão é o do cardápio. Pode ser sobrescrito por
 * NEXT_PUBLIC_META_PIXEL_ID (Vercel/local). ID público, não é segredo.
 */
export const META_PIXEL_ID = (
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "2651225795380915"
).trim();

export const isMetaPixelConfigured = /^\d{6,30}$/.test(META_PIXEL_ID);

/** Dispara um evento padrão do Pixel (ex.: "AddToCart", "InitiateCheckout"). */
export function trackMetaEvent(
  event: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq === "function") {
    fbq("track", event, params);
  }
}
