export function ProtectedBadge() {
  return (
    <div className="mx-5 mb-5 flex items-center justify-center gap-1.5 text-xs text-checkout-gray sm:mx-6">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-checkout-gray">
        <path d="M12 1 3 5v6c0 5.25 3.84 10.14 9 11 5.16-.86 9-5.75 9-11V5l-9-4Z" />
      </svg>
      Protegido por Whop
    </div>
  );
}
