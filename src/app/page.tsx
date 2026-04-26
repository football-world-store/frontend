import { Button } from "@/components";

const HomePage = () => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <span className="text-sm font-medium uppercase tracking-widest text-zinc-500">
        Football World Store
      </span>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
        Em breve, o stadium dos torcedores apaixonados.
      </h1>
      <p className="max-w-xl text-base text-zinc-600 dark:text-zinc-400">
        Estrutura inicial do frontend pronta. Cole o HTML do Stitch quando
        estiver pronto e comece a decompor em atoms, molecules e organisms.
      </p>
      <Button>Explorar produtos</Button>
    </main>
  );
};

export default HomePage;
