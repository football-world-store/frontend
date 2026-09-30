import Link from "next/link";

import { APP_ROUTES } from "@/constants";

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
          Acesso exclusivo
        </p>
        <h2
          id="cta-heading"
          className="font-headline text-3xl sm:text-5xl font-extrabold text-on-surface tracking-[-0.04em] leading-[0.95]"
        >
          Cadastre-se e acesse{" "}
          <span className="text-primary">ofertas exclusivas</span>
        </h2>
        <p className="font-body text-on-surface-variant text-lg max-w-xl leading-relaxed">
          Crie sua conta gratuitamente e tenha acesso a promoções, lançamentos
          antecipados e acompanhamento completo dos seus pedidos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={APP_ROUTES.auth.register}
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-primary text-on-primary font-label font-medium uppercase tracking-wide text-base transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Criar conta grátis
          </Link>
          <Link
            href={APP_ROUTES.portal.root}
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-surface-container-highest text-on-surface font-label font-medium uppercase tracking-wide text-base transition-all duration-200 hover:bg-surface-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Explorar catálogo
          </Link>
        </div>
      </div>
    </section>
  );
};
