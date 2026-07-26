export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-lg px-6 py-6 text-xs leading-relaxed text-white/40">
      <p>
        <a href="mailto:soporte@neuroproductivo.com" className="text-checkout-blue underline">
          ¿Tienes dudas sobre el producto? Ponte en contacto
        </a>
      </p>
      <p className="mt-2">
        <a href="mailto:soporte@neuroproductivo.com" className="text-checkout-blue underline">
          ¿No puedes finalizar la compra? Visita nuestra Central de Ayuda
        </a>
      </p>

      <p className="mt-4">
        Al hacer clic en &ldquo;Comprar ahora&rdquo;, declaras que entiendes que este pedido se procesa en nombre de{" "}
        <span className="text-white/60">MAJO Y RONALD</span> y aceptas los términos de compra. Los resultados
        individuales pueden variar.
      </p>

      <p className="mt-3">
        © {new Date().getFullYear()} NEUROPRODUCTIVO — Majo y Ronald. Todos los derechos reservados.
      </p>
    </footer>
  );
}
