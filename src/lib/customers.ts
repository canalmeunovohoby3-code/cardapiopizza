import { formatPhone, toE164 } from "@/lib/phone";
import { getSupabaseClient } from "@/lib/supabase";
import type { CheckoutCustomer, CustomerProfile } from "@/types";

/** Linha da tabela `customers` (snake_case). */
interface CustomerRow {
  id: string;
  phone: string | null;
  name: string | null;
  cep: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  reference: string | null;
}

/** Telefone sempre salvo no formato internacional só com dígitos. */
export function normalizePhone(value: string): string {
  return toE164(value).replace(/\D/g, "");
}

export function emptyProfile(): CustomerProfile {
  return {
    name: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    reference: "",
  };
}

export function rowToProfile(row: CustomerRow): CustomerProfile {
  return {
    id: row.id,
    name: row.name ?? "",
    phone: row.phone ?? "",
    cep: row.cep ?? "",
    street: row.street ?? "",
    number: row.number ?? "",
    complement: row.complement ?? "",
    neighborhood: row.neighborhood ?? "",
    city: row.city ?? "",
    reference: row.reference ?? "",
  };
}

/** Preenche o formulário de checkout com os dados salvos do cliente. */
export function profileToCustomer(
  profile: CustomerProfile,
  base: CheckoutCustomer,
): CheckoutCustomer {
  return {
    ...base,
    name: profile.name || base.name,
    whatsapp: profile.phone ? formatPhone(profile.phone) : base.whatsapp,
    cep: profile.cep || base.cep || "",
    address: profile.street || base.address,
    number: profile.number || base.number,
    complement: profile.complement || base.complement,
    district: profile.neighborhood || base.district,
    city: profile.city || base.city || "",
    reference: profile.reference || base.reference || "",
  };
}

/** Converte os dados do checkout no cadastro salvo no Supabase. */
export function customerToProfile(customer: CheckoutCustomer): CustomerProfile {
  return {
    name: customer.name.trim(),
    phone: normalizePhone(customer.whatsapp),
    cep: (customer.cep ?? "").trim(),
    street: customer.address.trim(),
    number: customer.number.trim(),
    complement: customer.complement.trim(),
    neighborhood: customer.district.trim(),
    city: (customer.city ?? "").trim(),
    reference: (customer.reference ?? "").trim(),
  };
}

/** Busca o cadastro pelo telefone. Retorna null se não existir. */
export async function findCustomerByPhone(
  phone: string,
): Promise<CustomerProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("get_customer_by_phone", {
    p_phone: normalizePhone(phone),
  });
  if (error) throw error;

  // Quando não encontra, a função devolve um objeto com id nulo.
  const row = (data as CustomerRow | null) ?? null;
  if (!row || !row.id) return null;
  return rowToProfile(row);
}

/** Cria ou atualiza o cadastro do cliente (chave: telefone). */
export async function saveCustomerProfile(
  customer: CheckoutCustomer,
): Promise<CustomerProfile> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase não configurado.");

  const profile = customerToProfile(customer);
  const { data, error } = await supabase.rpc("upsert_customer", {
    p_phone: profile.phone,
    p_name: profile.name,
    p_cep: profile.cep,
    p_street: profile.street,
    p_number: profile.number,
    p_complement: profile.complement,
    p_neighborhood: profile.neighborhood,
    p_city: profile.city,
    p_reference: profile.reference,
  });
  if (error) throw error;
  return rowToProfile(data as CustomerRow);
}
