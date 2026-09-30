const TESTIMONIALS = [
  {
    id: "1",
    author: "Lucas M.",
    city: "São Paulo, SP",
    text: "Recebi minha camisa do Flamengo em 2 dias! Qualidade impecável, igual à original vendida nos estádios.",
    rating: 5,
  },
  {
    id: "2",
    author: "Ana C.",
    city: "Belo Horizonte, MG",
    text: "Melhor loja de camisas do Brasil. Já comprei mais de 10 vezes e nunca tive problema nenhum.",
    rating: 5,
  },
  {
    id: "3",
    author: "Pedro R.",
    city: "Porto Alegre, RS",
    text: "Achei a camisa retrô do Brasil que procurava há anos. Atendimento excelente e entrega rápida.",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="bg-surface-container-low py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 space-y-3">
          <p className="font-label text-primary text-xs uppercase tracking-[0.2em] font-medium">
            Clientes satisfeitos
          </p>
          <h2
            id="testimonials-heading"
            className="font-headline text-3xl sm:text-4xl font-extrabold text-on-surface tracking-[-0.04em]"
          >
            O que dizem nossos clientes
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.id}
              className="bg-surface-container rounded-xl p-6 flex flex-col gap-4"
            >
              <div className="flex gap-1" aria-label={`${t.rating} estrelas`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span
                    key={i}
                    className="text-primary font-body text-base"
                    aria-hidden
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="font-body text-on-surface text-sm leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <footer className="flex flex-col gap-0.5">
                <cite className="font-body font-semibold text-on-surface text-sm not-italic">
                  {t.author}
                </cite>
                <span className="font-label text-on-surface-variant text-xs">
                  {t.city}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};
