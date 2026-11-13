import Image from "next/image";

import { withBasePath } from "@/utils";

interface Product {
  id: string;
  name: string;
  club: string;
  price: string;
  badge?: string;
  image: string;
}

const SELECAO_BRASILEIRA = "Seleção Brasileira";

const FEATURED_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Camisa De Seleção BR 2026 — Torcedor",
    club: SELECAO_BRASILEIRA,
    price: "R$ 199,99",
    badge: "Lançamento",
    image: "/products/camisa-selecao-br-2026.jpeg",
  },
  {
    id: "2",
    name: "Camisa Brasil 2026 Azul — Torcedor",
    club: SELECAO_BRASILEIRA,
    price: "R$ 199,99",
    image: "/products/camisa-brasil-2026-azul.jpeg",
  },
  {
    id: "3",
    name: "Camisa Polo Brasil Guaraná — Verde",
    club: SELECAO_BRASILEIRA,
    price: "R$ 199,99",
    badge: "Retrô",
    image: "/products/camisa-polo-brasil-guarana-verde.jpeg",
  },
  {
    id: "4",
    name: "Chuteira Nike Air Zoom Mercurial Vapor 15",
    club: "Nike",
    price: "R$ 399,99",
    image: "/products/chuteira-nike-mercurial.png",
  },
];

export const FeaturedProductsSection = () => {
  return (
    <section
      id="produtos"
      aria-labelledby="featured-heading"
      className="scroll-mt-20 bg-surface-container-low py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 space-y-3">
          <p className="font-label text-primary text-xs uppercase tracking-[0.2em] font-medium">
            Seleção exclusiva
          </p>
          <h2
            id="featured-heading"
            className="font-headline text-3xl sm:text-4xl font-extrabold text-on-surface tracking-[-0.04em]"
          >
            Produtos em Destaque
          </h2>
          <p className="font-body text-on-surface-variant max-w-xl mx-auto">
            Os itens mais procurados — sempre com autenticidade garantida.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="bg-surface-container rounded-xl overflow-hidden flex flex-col"
            >
              <div className="relative bg-surface-container-high aspect-square">
                {product.badge ? (
                  <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 font-label text-[0.625rem] uppercase tracking-widest text-primary font-bold">
                    {product.badge}
                  </span>
                ) : null}
                <Image
                  src={withBasePath(product.image)}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <p className="font-label text-on-surface-variant text-xs uppercase tracking-widest">
                  {product.club}
                </p>
                <h3 className="font-body font-semibold text-on-surface text-sm leading-snug">
                  {product.name}
                </h3>
                <p className="font-headline font-bold text-primary text-lg mt-auto pt-2">
                  {product.price}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://footballworld.store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-surface-container-highest text-on-surface font-label font-medium uppercase tracking-wide text-sm transition-all duration-200 hover:bg-surface-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Ver todos os produtos na loja
          </a>
        </div>
      </div>
    </section>
  );
};
