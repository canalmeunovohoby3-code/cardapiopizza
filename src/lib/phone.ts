export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Converte um telefone brasileiro para o formato E.164 aceito pelo
 * Supabase Auth. Ex.: "(45) 99999-9999" -> "+5545999999999".
 */
export function toE164(value: string): string {
  let digits = digitsOnly(value);

  if (digits.startsWith("55") && digits.length >= 12) {
    // já veio com DDI
  } else if (digits.length === 10 || digits.length === 11) {
    digits = `55${digits}`;
  }

  return `+${digits}`;
}

/** Valida um telefone brasileiro (DDD + 8 ou 9 dígitos). */
export function isValidBrazilianPhone(value: string): boolean {
  let digits = digitsOnly(value);
  if (digits.startsWith("55") && digits.length >= 12) {
    digits = digits.slice(2);
  }
  return digits.length === 10 || digits.length === 11;
}

/** Máscara visual: (45) 99999-9999 */
export function formatPhone(value: string): string {
  let digits = digitsOnly(value);
  if (digits.startsWith("55") && digits.length >= 12) {
    digits = digits.slice(2);
  }
  digits = digits.slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
