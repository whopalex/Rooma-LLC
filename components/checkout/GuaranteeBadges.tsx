function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-checkout-blue stroke-[1.5]">
      {children}
    </svg>
  );
}

const BADGES = [
  {
    title: "Privacidad",
    subtitle: "Tu información está 100% segura",
    icon: (
      <IconWrap>
        <path d="M12 2l7 3v6c0 5-3 8.5-7 10-4-1.5-7-5-7-10V5l7-3Z" strokeLinejoin="round" />
      </IconWrap>
    ),
  },
  {
    title: "Compra segura",
    subtitle: "Ambiente seguro y autenticado",
    icon: (
      <IconWrap>
        <path d="M12 2l7 3v6c0 5-3 8.5-7 10-4-1.5-7-5-7-10V5l7-3Z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </IconWrap>
    ),
  },
  {
    title: "Entrega por email",
    subtitle: "Acceso al producto entregado por email",
    icon: (
      <IconWrap>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 6.5l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
      </IconWrap>
    ),
  },
  {
    title: "Garantía de 7 días",
    subtitle: "Devolución completa si no es para ti",
    icon: (
      <IconWrap>
        <path d="M12 2l7 3v6c0 5-3 8.5-7 10-4-1.5-7-5-7-10V5l7-3Z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </IconWrap>
    ),
  },
];

export function GuaranteeBadges() {
  return (
    <div className="mx-auto max-w-lg space-y-3 px-4 py-8">
      {BADGES.map((b) => (
        <div key={b.title} className="flex items-center gap-4 rounded-lg border border-black/10 bg-white p-4">
          {b.icon}
          <div>
            <p className="text-sm font-bold italic text-checkout-dark">{b.title}</p>
            <p className="text-xs italic text-checkout-gray">{b.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
