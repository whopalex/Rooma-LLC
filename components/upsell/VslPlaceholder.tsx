export function VslPlaceholder() {
  return (
    <div className="relative mx-auto aspect-video w-full max-w-2xl overflow-hidden rounded-xl bg-black shadow-lg">
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
        <p className="text-sm">Video próximamente — reemplaza este bloque con tu VSL</p>
      </div>
    </div>
  );
}
