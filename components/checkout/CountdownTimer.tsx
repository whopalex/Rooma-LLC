"use client";

import { useEffect, useState } from "react";
import { formatRemaining, getCountdownDeadline } from "@/lib/countdown";

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-white stroke-2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CountdownTimer() {
  const [remaining, setRemaining] = useState<string | null>(null);

  useEffect(() => {
    const deadline = getCountdownDeadline();
    const tick = () => setRemaining(formatRemaining(deadline - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!remaining) return null;

  const [mm, ss] = remaining.split(":");

  return (
    <div className="sticky top-0 z-20 flex items-center justify-center gap-3 bg-checkout-blue py-3 text-white">
      <span className="font-mono text-xl font-extrabold tabular-nums tracking-widest sm:text-2xl">
        00 : {mm} : {ss}
      </span>
      <ClockIcon />
      <span className="hidden text-sm font-medium opacity-90 sm:inline">
        Precio de lanzamiento — termina pronto
      </span>
    </div>
  );
}
