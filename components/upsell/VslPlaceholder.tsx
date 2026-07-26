export function VslPlaceholder() {
  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[380px] overflow-hidden rounded-xl bg-black shadow-lg">
      {/*
        Reemplaza este bloque con tu embed de VTurb: pega el <script> y el
        <div id="vid_..."> que te da VTurb directamente aquí dentro, en lugar
        de este placeholder. VTurb suele ser responsive por sí solo, así que
        puedes quitar el aspect-[9/16] del contenedor padre si su embed ya
        trae su propio tamaño.
      */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/70">
        <button
          type="button"
          aria-label="Reproducir video"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/30 transition hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
            <path d="M8 5v14l11-7L8 5Z" />
          </svg>
        </button>
        <p className="px-6 text-center text-xs">Pega aquí tu código de VTurb</p>
      </div>
    </div>
  );
}
