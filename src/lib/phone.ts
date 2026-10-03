export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Converte um telefone brasileiro para o formato internacional (E.164)
 * SEMPRE com o código do país, para que qualquer formato digitado vire
 * o mesmo valor. Ex.:
 *   "(11) 99999-9999"  -> "+5511999999999"
 *   "11999999999"      -> "+5511999999999"
 *   "+55 11 99999-9999"-> "+5511999999999"
 *   "011 99999-9999"   -> "+5511999999999"
 */
export function toE164(value: string): string {
  // Remove não-dígitos e zeros iniciais (ex.: "011 ...").
  let digits = digitsOnly(value).replace(/^0+/, "");

  // Se ainda não tem o DDI 55, adiciona (DDD + 8/9 dígitos).
  if (!(digits.startsWith("55") && digits.length >= 12)) {
    if (digits.length === 10 || digits.length === 11) {
      digits = `55${digits}`;
    }
  }

  return `+${digits}`;
}

/** Valida um telefone brasileiro (DDD + 8 ou 9 dígitos), em qualquer formato. */
export function isValidBrazilianPhone(value: string): boolean {
  let digits = digitsOnly(value).replace(/^0+/, "");
  if (digits.startsWith("55") && digits.length >= 12) {
    digits = digits.slice(2);
  }
  return digits.length === 10 || digits.length === 11;
}

/** Máscara visual: (45) 99999-9999 */
export function formatPhone(value: string): string {
  let digits = digitsOnly(value).replace(/^0+/, "");
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
