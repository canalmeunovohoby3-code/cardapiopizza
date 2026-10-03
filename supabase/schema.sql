-- =====================================================================
-- SUPABASE — CADASTRO SIMPLES DE CLIENTES (POR TELEFONE)
-- ---------------------------------------------------------------------
-- SEM autenticação, SEM OTP/SMS. Rode no painel:
-- SQL Editor -> New query -> Run.
--
-- O telefone identifica o cadastro. O app só acessa os dados por duas
-- funções (buscar e salvar), e a tabela fica bloqueada para acesso
-- direto — assim ninguém consegue LISTAR todos os clientes.
-- =====================================================================

create extension if not exists pgcrypto;

create table if not exists public.customers (
  id           uuid primary key default gen_random_uuid(),
  phone        text not null unique,
  name         text,
  cep          text,
  street       text,
  number       text,
  complement   text,
  neighborhood text,
  city         text,
  reference    text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Garante unicidade do telefone também em tabelas criadas antes.
create unique index if not exists customers_phone_key on public.customers (phone);

-- ---------------------------------------------------------------------
-- Migração da versão anterior (caso a tabela tenha sido criada com
-- `user_id` e NOT NULL). Deixa `user_id` opcional e remove o vínculo.
-- Seguro para rodar mesmo que a coluna não exista.
-- ---------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'customers' and column_name = 'user_id'
  ) then
    alter table public.customers drop constraint if exists customers_user_id_key;
    alter table public.customers alter column user_id drop not null;
  end if;
end $$;

-- RLS habilitado SEM políticas: acesso direto pela API fica negado.
-- O acesso acontece apenas pelas funções abaixo (SECURITY DEFINER).
alter table public.customers enable row level security;

-- ---------------------------------------------------------------------
-- Buscar cadastro pelo telefone (retorna 1 cliente ou nada).
-- ---------------------------------------------------------------------
create or replace function public.get_customer_by_phone(p_phone text)
returns public.customers
language sql
security definer
set search_path = public
as $$
  select *
  from public.customers
  where phone = regexp_replace(coalesce(p_phone, ''), '\D', '', 'g')
  limit 1;
$$;

-- ---------------------------------------------------------------------
-- Criar/atualizar cadastro pelo telefone (upsert).
-- ---------------------------------------------------------------------
create or replace function public.upsert_customer(
  p_phone text,
  p_name text,
  p_cep text,
  p_street text,
  p_number text,
  p_complement text,
  p_neighborhood text,
  p_city text,
  p_reference text
)
returns public.customers
language plpgsql
security definer
set search_path = public
as $$
declare
  v_phone text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  v_row public.customers;
begin
  -- Não cria cadastro sem telefone.
  if v_phone = '' then
    return null;
  end if;

  insert into public.customers
    (phone, name, cep, street, number, complement, neighborhood, city, reference, updated_at)
  values
    (v_phone, p_name, p_cep, p_street, p_number, p_complement, p_neighborhood, p_city, p_reference, now())
  on conflict (phone) do update set
    name         = excluded.name,
    cep          = excluded.cep,
    street       = excluded.street,
    number       = excluded.number,
    complement   = excluded.complement,
    neighborhood = excluded.neighborhood,
    city         = excluded.city,
    reference    = excluded.reference,
    updated_at   = now()
  returning * into v_row;

  return v_row;
end;
$$;

-- Permite que o frontend (chave anon) chame as funções.
grant execute on function public.get_customer_by_phone(text) to anon, authenticated;
grant execute on function public.upsert_customer(text, text, text, text, text, text, text, text, text) to anon, authenticated;

-- Limpeza: remove cadastros sem telefone (inválidos).
delete from public.customers where phone = '' or phone is null;

-- =====================================================================
-- OBSERVAÇÃO DE PRIVACIDADE
-- Como não há login, qualquer pessoa que saiba um telefone pode buscar
-- o cadastro correspondente (comportamento esperado deste fluxo). Em
-- troca, NÃO é possível listar todos os clientes pela API. Se um dia
-- precisar de mais proteção, o caminho é adicionar verificação por OTP.
-- =====================================================================
