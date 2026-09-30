import Link from "next/link";

import { APP_ROUTES } from "@/constants";

interface Product {
  id: string;
  name: string;
  club: string;
  price: string;
  badge?: string;
  abbr: string;
}

const FEATURED_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Camisa Titular 2024/25",
    club: "Flamengo",
    price: "R$ 299,90",
    badge: "Lançamento",
    abbr: "FLA",
  },
  {
    id: "2",
    name: "Camisa Away 2024/25",
    club: "Palmeiras",
    price: "R$ 279,90",
    badge: "Destaque",
    abbr: "PAL",
  },
  {
    id: "3",
    name: "Camisa Retrô 1994",
    club: "Brasil",
    price: "R$ 249,90",
    badge: "Retrô",
    abbr: "BRA",
  },
  {
    id: "4",
    name: "Camisa Third 2024",
    club: "Corinthians",
    price: "R$ 269,90",
    abbr: "COR",
  },
];

export const FeaturedProductsSection = () => {
  return (
    <section
      aria-labelledby="featured-heading"
      className="bg-surface-container-low py-20 px-4 sm:px-6 lg:px-8"
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
              <div className="relative bg-surface-container-high aspect-square flex items-center justify-center">
                {product.badge ? (
                  <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 font-label text-[0.625rem] uppercase tracking-widest text-primary font-bold">
                    {product.badge}
                  </span>
                ) : null}
                <span
                  className="font-headline text-5xl font-black text-on-surface-variant/30 select-none"
                  aria-hidden
                >
                  {product.abbr}
                </span>
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
          <Link
            href={APP_ROUTES.portal.root}
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-surface-container-highest text-on-surface font-label font-medium uppercase tracking-wide text-sm transition-all duration-200 hover:bg-surface-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Ver todos os produtos
          </Link>
        </div>
      </div>
    </section>
  );
};
