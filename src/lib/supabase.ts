import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * =====================================================================
 * SUPABASE (cadastro simples de clientes por telefone)
 * ---------------------------------------------------------------------
 * Sem autenticação, sem OTP/SMS. Usa SOMENTE a chave pública (anon),
 * que acessa apenas as funções criadas em supabase/schema.sql.
 * NUNCA coloque a service_role aqui.
 *
 * Configure em .env.local e na Vercel:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
 *
 * Sem a chave anon, `isSupabaseConfigured` fica false e o cardápio
 * continua funcionando normalmente (só não salva/recupera o cadastro).
 * =====================================================================
 */

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://omtvmmvwterkgdbdbikk.supabase.co";

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
