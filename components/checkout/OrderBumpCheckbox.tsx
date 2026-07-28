"use client";
/* eslint-disable @next/next/no-img-element */

import { useCurrency } from "./CurrencyContext";

interface OrderBumpCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CHECKLIST = [
  "¿Por qué procrastino si sé qué hacer?",
  "¿Cuál es el bloqueo REAL que me paraliza?",
  "¿Por qué inicié cosas y no las terminé?",
];

export function OrderBumpCheckbox({ checked, onChange }: OrderBumpCheckboxProps) {
  const { formatPrice, prices } = useCurrency();

  return (
    <div className="mx-5 mb-5 rounded-lg border border-checkout-green/40 bg-checkout-green-light p-4 sm:mx-6">
      <p className="mb-3 text-sm font-bold text-checkout-dark">Aprovecha y compra:</p>

      <div className="flex items-start gap-3">
        <img
          src="/order-bump-sesion-1a1.png"
          alt="Sesión 1:1 — 60 minutos de guía productiva"
          className="h-20 w-[4.4rem] shrink-0 rounded-md object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-checkout-dark">
            Sesión 1 a 1 Diagnóstico de Bloqueo Mental (vía Meet)
          </p>
          <ul className="mt-1.5 space-y-1 text-xs text-checkout-dark/80">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex gap-1.5">
                <span className="text-checkout-green">✅</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-checkout-gray">
        En 60 minutos descubrimos tu origen exacto y tu perfil real. Basados en tu perfil, te mostramos el camino
        ideal para que empieces y no vuelvas a parar. 🚀
      </p>

      <p className="mt-2 text-base font-extrabold text-checkout-dark">{formatPrice(prices.bump)}</p>

      <label className="mt-3 flex cursor-pointer items-center gap-2 border-t border-checkout-green/20 pt-3 text-sm font-semibold text-checkout-dark">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 shrink-0 accent-checkout-green"
        />
        Añadir a la compra
      </label>
    </div>
  );
}
