"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { Modal } from "@/components/Modal";
import { CheckIcon, CloseIcon, WhatsAppIcon } from "@/components/Icons";
import { TextField } from "@/components/forms/TextField";
import { useCart } from "@/context/CartContext";
import { pizzeria, WHATSAPP_NUMBER } from "@/data/config";
import { cn } from "@/lib/cn";
import {
  findCustomerByPhone,
  profileToCustomer,
  saveCustomerProfile,
} from "@/lib/customers";
import { formatBRL } from "@/lib/format";
import { loadCustomer, saveCustomer } from "@/lib/cart-storage";
import { paymentLabels } from "@/lib/order";
import { isSupabaseConfigured } from "@/lib/supabase";
import { buildOrderMessage, buildWhatsAppUrl, openWhatsApp } from "@/lib/whatsapp";
import type { CheckoutCustomer, CheckoutErrors, PaymentMethod } from "@/types";

interface CheckoutModalProps {
  onClose: () => void;
}

type Step = "identify" | "form";

interface LookupFeedback {
  message: string;
  tone: "found" | "new" | "error";
}

const paymentOptions: Array<{ id: PaymentMethod; label: string; emoji: string }> = [
  { id: "dinheiro", label: "Dinheiro", emoji: "💵" },
  { id: "pix", label: "Pix", emoji: "⚡" },
  { id: "credito", label: "Cartão de crédito", emoji: "💳" },
  { id: "debito", label: "Cartão de débito", emoji: "💳" },
];

const emptyCustomer: CheckoutCustomer = {
  name: "",
  whatsapp: "",
  address: "",
  number: "",
  district: "",
  complement: "",
  payment: "pix",
  change: "",
  notes: "",
  cep: "",
  city: "",
  reference: "",
};

function sanitizeCustomer(saved: CheckoutCustomer | null): CheckoutCustomer {
  if (!saved) return emptyCustomer;
  const validPayment = paymentOptions.some((option) => option.id === saved.payment)
    ? saved.payment
    : "pix";
  return { ...emptyCustomer, ...saved, payment: validPayment };
}

function validate(customer: CheckoutCustomer): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (customer.name.trim().length < 2) errors.name = "Informe seu nome.";
  if (customer.whatsapp.replace(/\D/g, "").length < 10)
    errors.whatsapp = "Informe um WhatsApp válido com DDD.";
  if (customer.address.trim().length < 3)
    errors.address = "Informe a rua ou avenida.";
  if (!customer.number.trim()) errors.number = "Informe o número.";
  if (customer.district.trim().length < 2) errors.district = "Informe o bairro.";
  return errors;
}

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { items, gifts, summary, itemCount, clearCart } = useCart();
  const [customer, setCustomer] = useState<CheckoutCustomer>(() =>
    sanitizeCustomer(loadCustomer()),
  );
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [sent, setSent] = useState(false);
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [lookupBusy, setLookupBusy] = useState(false);
  const [feedback, setFeedback] = useState<LookupFeedback | null>(null);
  const [step, setStep] = useState<Step>(isSupabaseConfigured ? "identify" : "form");
  const scrollRef = useRef<HTMLDivElement>(null);

  function setField<K extends keyof CheckoutCustomer>(
    name: K,
    value: CheckoutCustomer[K],
  ) {
    setCustomer((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setField(name as keyof CheckoutCustomer, value);
  }

  async function handleLookup(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const digits = customer.whatsapp.replace(/\D/g, "");
    if (digits.length < 10) {
      setErrors((prev) => ({
        ...prev,
        whatsapp: "Informe um WhatsApp válido com DDD.",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, whatsapp: undefined }));
    setLookupBusy(true);
    setFeedback(null);

    if (!isSupabaseConfigured) {
      setStep("form");
      setLookupBusy(false);
      return;
    }

    try {
      const found = await findCustomerByPhone(customer.whatsapp);
      if (found) {
        setCustomer((prev) => profileToCustomer(found, prev));
        setFeedback({
          message: "Cadastro encontrado! Seus dados foram preenchidos automaticamente.",
          tone: "found",
        });
      } else {
        setFeedback({
          message: "Novo cadastro — confira e complete seus dados.",
          tone: "new",
        });
      }
      setStep("form");
    } catch {
      setFeedback({
        message: "Não foi possível buscar agora. Preencha seus dados normalmente.",
        tone: "error",
      });
      setStep("form");
    } finally {
      setLookupBusy(false);
    }
  }

  async function lookupCep(rawCep: string) {
    const digits = rawCep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = (await response.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };
      if (data.erro) return;
      setCustomer((prev) => ({
        ...prev,
        address: data.logradouro || prev.address,
        district: data.bairro || prev.district,
        city:
          data.localidade && data.uf
            ? `${data.localidade} - ${data.uf}`
            : prev.city,
      }));
    } catch {
      /* CEP é opcional; segue sem preencher */
    } finally {
      setCepLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const foundErrors = validate(customer);
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (isSupabaseConfigured) {
      try {
        await saveCustomerProfile(customer);
      } catch {
        /* Salvar o cadastro não deve impedir o pedido. */
      }
    }

    // 1) Monta a mensagem com o carrinho ainda cheio.
    const message = buildOrderMessage({ items, gifts, summary, customer });
    const url = buildWhatsAppUrl(WHATSAPP_NUMBER, message);
    saveCustomer(customer);
    // 2) Abre o WhatsApp...
    openWhatsApp(WHATSAPP_NUMBER, message);
    // 3) ...e só então limpa o carrinho (estado + localStorage).
    clearCart();
    setSentUrl(url);
    setSent(true);
  }

  const hasErrors = Object.values(errors).some(Boolean);

  const header = (
    <header className="flex items-start justify-between gap-3 border-b border-line bg-white px-4 py-3.5">
      <div>
        <h2 className="font-display text-lg font-extrabold text-ink">
          Finalizar pedido
        </h2>
        <p className="text-xs text-ink-soft">
          {step === "identify"
            ? "Informe seu WhatsApp para preencher seus dados automaticamente."
            : `${pizzeria.delivery.headline} Taxa de ${formatBRL(pizzeria.delivery.fee)}.`}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream-2 text-ink-soft transition active:scale-95"
      >
        <CloseIcon className="h-5 w-5" />
      </button>
    </header>
  );

  const summaryBlock = (
    <div className="rounded-2xl border border-line bg-white p-3.5">
      <p className="font-display text-sm font-bold text-ink">Resumo do pedido</p>
      <dl className="mt-2 space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-soft">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "itens"})
          </dt>
          <dd className="font-semibold text-ink">{formatBRL(summary.subtotal)}</dd>
        </div>
        {gifts.map((gift) => (
          <div key={gift.id} className="flex justify-between">
            <dt className="text-ink-soft">
              🎁 {gift.quantity > 1 ? `${gift.quantity}x ` : ""}
              {gift.name}
            </dt>
            <dd className="font-semibold text-brand-green">GRÁTIS</dd>
          </div>
        ))}
        <div className="flex justify-between">
          <dt className="text-ink-soft">Taxa de entrega</dt>
          <dd className="font-semibold text-ink">{formatBRL(summary.deliveryFee)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-2">
          <dt className="font-display font-bold text-ink">Total</dt>
          <dd className="font-display text-lg font-extrabold text-brand-green">
            {formatBRL(summary.total)}
          </dd>
        </div>
      </dl>
    </div>
  );

  const feedbackBlock = feedback ? (
    <p
      role="status"
      className={cn(
        "rounded-2xl px-3.5 py-2.5 text-xs font-semibold",
        feedback.tone === "found"
          ? "bg-brand-green-soft text-brand-green"
          : feedback.tone === "error"
            ? "bg-brand-red-soft text-brand-red-dark"
            : "bg-brand-yellow-soft text-ink",
      )}
    >
      {feedback.message}
    </p>
  ) : null;

  return (
    <Modal
      open
      onClose={onClose}
      ariaLabel="Finalizar pedido"
      maxWidthClass="sm:max-w-lg"
    >
      {sent ? (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-green-soft text-brand-green">
            <CheckIcon className="h-8 w-8" />
          </span>
          <h2 className="font-display text-xl font-extrabold text-ink">
            Pedido enviado!
          </h2>
          <p className="text-sm text-ink-soft">
            Abrimos o WhatsApp da pizzaria com o resumo do seu pedido. Se a janela não
            abriu, toque no botão abaixo.
          </p>
          {sentUrl ? (
            <a
              href={sentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-green px-6 font-display text-base font-bold text-white transition active:scale-[0.98]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Abrir WhatsApp
            </a>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-full border border-line font-display text-sm font-bold text-ink transition active:scale-[0.98]"
          >
            Fazer novo pedido
          </button>
        </div>
      ) : step === "identify" ? (
        <form onSubmit={handleLookup} className="flex min-h-0 flex-1 flex-col">
          {header}
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            <TextField
              id="whatsapp"
              label="WhatsApp"
              value={customer.whatsapp}
              onChange={handleChange}
              error={errors.whatsapp}
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(45) 99999-9999"
            />
            <button
              type="submit"
              disabled={lookupBusy}
              className="h-12 w-full rounded-full bg-brand-green font-display text-base font-bold text-white transition active:scale-[0.98] disabled:opacity-60"
            >
              {lookupBusy ? "Buscando..." : "Buscar"}
            </button>
            <p className="text-center text-[11px] text-ink-soft">
              Se já pediu aqui, seus dados aparecem automaticamente. Se for a primeira
              vez, é só completar o cadastro.
            </p>
            {feedbackBlock}
            {summaryBlock}
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          {header}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            {hasErrors ? (
              <p
                role="alert"
                className="mb-3 rounded-2xl bg-brand-red-soft px-3.5 py-2.5 text-xs font-semibold text-brand-red-dark"
              >
                Confira os campos destacados antes de enviar.
              </p>
            ) : null}

            {feedbackBlock ? <div className="mb-3">{feedbackBlock}</div> : null}

            <div className="space-y-3">
              <div className="grid grid-cols-[1fr_auto] items-start gap-2">
                <TextField
                  id="whatsapp"
                  label="WhatsApp"
                  value={customer.whatsapp}
                  onChange={handleChange}
                  error={errors.whatsapp}
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(45) 99999-9999"
                />
                {isSupabaseConfigured ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFeedback(null);
                      setStep("identify");
                    }}
                    className="mt-5 h-11 shrink-0 rounded-2xl border border-brand-green/40 bg-white px-3 text-xs font-bold text-brand-green transition active:scale-95"
                  >
                    Trocar
                  </button>
                ) : null}
              </div>

              <TextField
                id="name"
                label="Nome"
                value={customer.name}
                onChange={handleChange}
                error={errors.name}
                required
                autoComplete="name"
                placeholder="Seu nome completo"
              />

              <div className="grid grid-cols-[140px_1fr] gap-3">
                <TextField
                  id="cep"
                  label="CEP"
                  value={customer.cep ?? ""}
                  onChange={(event) => setField("cep", formatCep(event.target.value))}
                  onBlur={(event) => void lookupCep(event.target.value)}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="00000-000"
                  hint={cepLoading ? "Buscando..." : undefined}
                />
                <TextField
                  id="address"
                  label="Endereço de entrega"
                  value={customer.address}
                  onChange={handleChange}
                  error={errors.address}
                  required
                  autoComplete="street-address"
                  placeholder="Rua / Avenida"
                />
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-3">
                <TextField
                  id="number"
                  label="Número"
                  value={customer.number}
                  onChange={handleChange}
                  error={errors.number}
                  required
                  inputMode="numeric"
                  placeholder="123"
                />
                <TextField
                  id="complement"
                  label="Complemento"
                  value={customer.complement}
                  onChange={handleChange}
                  placeholder="Apto, casa, referência"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  id="district"
                  label="Bairro"
                  value={customer.district}
                  onChange={handleChange}
                  error={errors.district}
                  required
                  placeholder="Seu bairro"
                />
                <TextField
                  id="city"
                  label="Cidade"
                  value={customer.city ?? ""}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  placeholder="Cidade - UF"
                />
              </div>
              <TextField
                id="reference"
                label="Ponto de referência"
                value={customer.reference ?? ""}
                onChange={handleChange}
                placeholder="Algo que ajude o entregador"
              />

              <fieldset>
                <legend className="text-xs font-semibold text-ink">
                  Forma de pagamento<span className="text-brand-red"> *</span>
                </legend>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {paymentOptions.map((option) => {
                    const active = customer.payment === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          setCustomer((prev) => ({ ...prev, payment: option.id }))
                        }
                        aria-pressed={active}
                        className={cn(
                          "flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-left text-xs font-semibold transition sm:text-sm",
                          active
                            ? "border-brand-green bg-brand-green-soft text-ink"
                            : "border-line bg-white text-ink-soft",
                        )}
                      >
                        <span aria-hidden="true">{option.emoji}</span>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {customer.payment === "dinheiro" ? (
                <div className="anim-fade-up">
                  <TextField
                    id="change"
                    label="Precisa de troco para quanto?"
                    value={customer.change}
                    onChange={handleChange}
                    placeholder="Ex.: R$ 50,00 (deixe vazio se não precisar)"
                  />
                </div>
              ) : null}

              <TextField
                id="notes"
                label="Observação do pedido"
                value={customer.notes}
                onChange={handleChange}
                textarea
                placeholder="Sem cebola, ponto da massa, etc."
              />
            </div>

            <div className="mt-4">{summaryBlock}</div>
          </div>

          <footer className="border-t border-line bg-white px-4 pt-3 pb-safe">
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-green px-4 py-2.5 text-center font-display text-sm font-bold leading-tight text-white transition active:scale-[0.98] sm:text-base"
            >
              <WhatsAppIcon className="h-5 w-5 shrink-0" />
              Finalizar pedido pelo WhatsApp
            </button>
            <p className="mt-2 text-center text-[11px] text-ink-soft">
              Pagamento combinado na entrega. {paymentLabels[customer.payment]}.
            </p>
          </footer>
        </form>
      )}
    </Modal>
  );
}
