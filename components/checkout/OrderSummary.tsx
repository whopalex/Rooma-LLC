interface OrderSummaryProps {
  orderBump: boolean;
}

export function OrderSummary({ orderBump }: OrderSummaryProps) {
  const total = orderBump ? 94 : 67;

  return (
    <div className="mx-5 mb-4 text-sm sm:mx-6">
      <p className="mb-2 text-sm font-bold text-checkout-dark">Detalles de la compra</p>
      <div className="flex items-center justify-between">
        <span className="text-checkout-gray">NEUROPRODUCTIVO</span>
        <span className="font-semibold text-checkout-dark">$67.00</span>
      </div>
      {orderBump && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-checkout-gray">Sesión 1 a 1 Diagnóstico de Bloqueo Mental</span>
          <span className="font-semibold text-checkout-dark">$27.00</span>
        </div>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3">
        <span className="font-bold text-checkout-dark">Total a Pagar</span>
        <span className="font-bold text-checkout-dark">${total.toFixed(2)} USD</span>
      </div>
    </div>
  );
}
