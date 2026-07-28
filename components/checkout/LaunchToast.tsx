"use client";

import { useEffect, useState } from "react";

const AUTO_DISMISS_MS = 5000;

export function LaunchToast() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed right-3 top-16 z-30 flex max-w-xs items-start gap-2 rounded-lg bg-checkout-green-light px-4 py-3 text-sm font-medium text-checkout-green shadow-lg sm:right-6">
      <span>¡Precio de lanzamiento activado!</span>
      <button
        type="button"
        aria-label="Cerrar"
        onClick={() => setVisible(false)}
        className="ml-1 text-checkout-green/60 hover:text-checkout-green"
      >
        ✕
      </button>
    </div>
  );
}
