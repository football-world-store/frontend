import { ENV } from "@/constants";
import { buildWhatsAppLink } from "@/utils";

const WHATSAPP_MESSAGE =
  "Olá! Vim pelo site da Football World Store e quero aproveitar as ofertas.";

export const CTASection = () => {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative bg-surface overflow-hidden py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vh] rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <p className="font-label text-primary text-xs uppercase tracking-[0.2em] font-medium">
          Atendimento rápido
        </p>
        <h2
          id="cta-heading"
          className="font-headline text-3xl sm:text-5xl font-extrabold text-on-surface tracking-[-0.04em] leading-[0.95]"
        >
          Fale com a gente e garanta{" "}
          <span className="text-primary">a sua camisa</span>
        </h2>
        <p className="font-body text-on-surface-variant text-lg max-w-xl leading-relaxed">
          Veja o catálogo completo na loja online ou fale direto com a gente
          pelo WhatsApp pra tirar dúvidas e fechar o pedido.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href="https://footballworld.store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-primary text-on-primary font-label font-medium uppercase tracking-wide text-base transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Ver Loja Completa
          </a>
          <a
            href={buildWhatsAppLink(ENV.WHATSAPP_NUMBER, WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-surface-container-highest text-on-surface font-label font-medium uppercase tracking-wide text-base transition-all duration-200 hover:bg-surface-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};
