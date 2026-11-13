import Image from "next/image";

import { ENV } from "@/constants";
import { withBasePath } from "@/utils";

export const AcaiSection = () => {
  return (
    <section
      id="acai"
      aria-labelledby="acai-heading"
      className="scroll-mt-20 relative bg-surface-container-highest shadow-ambient overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[40vh] rounded-full bg-primary/6 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-10 items-center text-center sm:text-left">
        <div className="flex justify-center">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-ambient">
            <Image
              src={withBasePath("/acai/acai-da-toca-logo.jpg")}
              alt="Açaí da Toca"
              fill
              sizes="176px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-start gap-6">
          <p className="font-label text-primary text-xs uppercase tracking-[0.2em] font-medium">
            Mais que camisas — também temos
          </p>
          <h2
            id="acai-heading"
            className="font-headline text-3xl sm:text-5xl font-extrabold text-on-surface tracking-[-0.04em] leading-[0.95]"
          >
            <span className="text-primary">Açaí da Toca</span>
          </h2>
          <p className="font-body text-on-surface-variant text-lg max-w-xl leading-relaxed">
            Monte seu açaí do seu jeito: escolha o tamanho, as frutas,
            coberturas e acompanhamentos. Peça online e retire na loja ou receba
            em casa.
          </p>
          <a
            href={ENV.ACAI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-primary text-on-primary font-label font-medium uppercase tracking-wide text-base transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Pedir Açaí
          </a>
        </div>
      </div>
    </section>
  );
};
