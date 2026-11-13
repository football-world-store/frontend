import Image from "next/image";
import Link from "next/link";

import { APP_ROUTES, ENV } from "@/constants";
import { buildWhatsAppLink, withBasePath } from "@/utils";

const WHATSAPP_MESSAGE =
  "Olá! Vim pelo site da Football World Store e quero ver as camisas disponíveis.";

export const HeroSection = () => {
  return (
    <section
      aria-label="Destaque principal"
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-surface"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-8">
          <p className="font-label text-primary text-xs uppercase tracking-[0.2em] font-medium">
            Elite Performance Tier
          </p>
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-[-0.04em] leading-[0.95] max-w-xl">
            As melhores camisas <span className="text-primary">de futebol</span>{" "}
            do Brasil
          </h1>
          <p className="font-body text-on-surface-variant text-lg max-w-xl leading-relaxed">
            Originals, retrôs e lançamentos das maiores equipes do mundo.
            Qualidade premium, entrega rápida e preço justo.
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

          <Link
            href={APP_ROUTES.auth.signIn}
            className="flex flex-col sm:inline-flex sm:flex-row items-center gap-1 sm:gap-2 rounded-xl border-ghost px-4 py-2 font-label text-on-surface-variant text-sm text-center hover:text-on-surface transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span>Temos um espaço VIP feito pra você</span>
            <span className="text-primary font-semibold">Venha conhecer →</span>
          </Link>
        </div>

        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-[80%] aspect-square rounded-full bg-primary/10 blur-3xl"
            aria-hidden
          />
          <div className="relative bg-surface-container-highest shadow-ambient rounded-2xl p-6 sm:p-10 w-full max-w-md">
            <Image
              src={withBasePath("/products/chuteira-nike-mercurial.png")}
              alt="Chuteira Nike Air Zoom Mercurial Vapor 15"
              width={430}
              height={430}
              priority
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
