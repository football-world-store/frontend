const STORE_ADDRESS =
  "Football World Store, Galeria Umbuzeiros, Praça Imaculada Conceição, Macaúbas, BA, 46500-000";

const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(STORE_ADDRESS)}&output=embed`;

const MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`;

export const LocationSection = () => {
  return (
    <section
      id="loja-fisica"
      aria-labelledby="location-heading"
      className="scroll-mt-20 bg-surface-container-low py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 space-y-3">
          <p className="font-label text-primary text-xs uppercase tracking-[0.2em] font-medium">
            Loja física
          </p>
          <h2
            id="location-heading"
            className="font-headline text-3xl sm:text-4xl font-extrabold text-on-surface tracking-[-0.04em]"
          >
            Visite a Football World Store
          </h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="bg-surface-container rounded-xl overflow-hidden min-h-[320px]">
            <iframe
              title="Mapa — Football World Store, Macaúbas, BA"
              src={MAPS_EMBED_URL}
              className="w-full h-full min-h-[320px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="bg-surface-container rounded-xl p-6 sm:p-8 flex flex-col gap-6 justify-center">
            <div
              className="flex items-center gap-2"
              aria-label="4,9 mil avaliações no Google"
            >
              <span className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-primary font-body text-lg">
                    ★
                  </span>
                ))}
              </span>
              <span className="font-body font-semibold text-on-surface text-sm">
                4.919 avaliações no Google
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-label text-on-surface-variant text-xs uppercase tracking-widest">
                Endereço
              </p>
              <p className="font-body text-on-surface text-base leading-relaxed">
                Galeria Umbuzeiros — Praça Imaculada Conceição
                <br />
                Macaúbas, BA, 46500-000
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-label text-on-surface-variant text-xs uppercase tracking-widest">
                Telefone / WhatsApp
              </p>
              <p className="font-body text-on-surface text-base">
                (77) 99701-1339
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-label text-on-surface-variant text-xs uppercase tracking-widest">
                Horário de atendimento
              </p>
              <p className="font-body text-on-surface text-base">
                Segunda a sábado, 9h às 18h
              </p>
            </div>

            <a
              href={MAPS_SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-surface-container-highest text-on-surface font-label font-medium uppercase tracking-wide text-sm transition-all duration-200 hover:bg-surface-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary self-start"
            >
              Ver no Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
