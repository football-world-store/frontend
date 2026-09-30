import Link from "next/link";

import { APP_ROUTES } from "@/constants";

export const HeroSection = () => {
  return (
    <section
      aria-label="Destaque principal"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-surface"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center gap-8">
        <p className="font-label text-primary text-xs uppercase tracking-[0.2em] font-medium">
          Elite Performance Tier
        </p>
        <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-[-0.04em] leading-[0.95] max-w-3xl">
          As melhores camisas <span className="text-primary">de futebol</span>{" "}
          do Brasil
        </h1>
        <p className="font-body text-on-surface-variant text-lg max-w-xl leading-relaxed">
          Originals, retrôs e lançamentos das maiores equipes do mundo.
          Qualidade premium, entrega rápida e preço justo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={APP_ROUTES.portal.root}
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-primary text-on-primary font-label font-medium uppercase tracking-wide text-base transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Ver Produtos
          </Link>
          <Link
            href={APP_ROUTES.auth.register}
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-surface-container-highest text-on-surface font-label font-medium uppercase tracking-wide text-base transition-all duration-200 hover:bg-surface-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </section>
  );
};
