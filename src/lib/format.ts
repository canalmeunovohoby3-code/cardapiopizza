/**
 * Formatação de moeda determinística (pt-BR), sem depender do ICU do
 * ambiente — assim o HTML do servidor e o do cliente ficam idênticos.
 */
export function formatBRL(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  const fixed = Math.round(safe * 100) / 100;
  const negative = fixed < 0;
  const [intPart, decPart] = Math.abs(fixed).toFixed(2).split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negative ? "-" : ""}R$ ${grouped},${decPart}`;
}
