const BRANDS = [
  { name: "Nike", abbr: "NK" },
  { name: "Adidas", abbr: "ADI" },
  { name: "Puma", abbr: "PMA" },
  { name: "Umbro", abbr: "UMB" },
  { name: "New Balance", abbr: "NB" },
  { name: "Penalty", abbr: "PEN" },
];

export const BrandsSection = () => {
  return (
    <section
      aria-labelledby="brands-heading"
      className="bg-surface py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          id="brands-heading"
          className="text-center font-label text-on-surface-variant text-xs uppercase tracking-[0.2em] font-medium mb-8"
        >
          Marcas disponíveis
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {BRANDS.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center justify-center w-24 h-12 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors duration-200"
              title={brand.name}
            >
              <span
                className="font-headline font-black text-on-surface-variant text-sm tracking-wider select-none"
                aria-label={brand.name}
              >
                {brand.abbr}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
