import { Logo } from "@/components/atoms";

const CURRENT_YEAR = new Date().getFullYear();

export const SiteFooter = () => {
  return (
    <footer className="bg-surface-container-lowest py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8 text-center sm:text-left">
        <div className="flex flex-col items-center sm:items-start gap-3">
          <Logo variant="compact" size="sm" />
          <p className="font-body text-on-surface-variant text-sm max-w-xs">
            Camisas de futebol originais e açaí — Galeria Umbuzeiros, Macaúbas,
            BA.
          </p>
        </div>

        <nav
          aria-label="Links rápidos"
          className="flex flex-col items-center sm:items-start gap-2"
        >
          <p className="font-label text-on-surface text-xs uppercase tracking-widest mb-1">
            Navegação
          </p>
          <a
            href="#produtos"
            className="font-body text-on-surface-variant text-sm hover:text-on-surface transition-colors duration-200"
          >
            Produtos
          </a>
          <a
            href="#acai"
            className="font-body text-on-surface-variant text-sm hover:text-on-surface transition-colors duration-200"
          >
            Açaí
          </a>
          <a
            href="#loja-fisica"
            className="font-body text-on-surface-variant text-sm hover:text-on-surface transition-colors duration-200"
          >
            Loja física
          </a>
        </nav>

        <div className="flex flex-col items-center sm:items-start gap-2">
          <p className="font-label text-on-surface text-xs uppercase tracking-widest mb-1">
            Contato
          </p>
          <p className="font-body text-on-surface-variant text-sm">
            (77) 99701-1339
          </p>
          <p className="font-body text-on-surface-variant text-sm">
            Seg a sáb, 9h às 18h
          </p>
        </div>
      </div>

      <p className="text-center font-label text-on-surface-variant text-xs mt-10">
        © {CURRENT_YEAR} Football World Store. Todos os direitos reservados.
      </p>
    </footer>
  );
};
