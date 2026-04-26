import { type ReactNode } from "react";

import { Logo } from "@/components/atoms";

interface AuthLayoutProps {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  side?: ReactNode;
}

export const AuthLayout = ({
  title,
  description,
  children,
  side,
}: AuthLayoutProps) => {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-surface relative overflow-hidden font-body text-on-surface">
      <div
        className="fixed top-0 right-0 w-1/3 h-screen bg-surface-container-low/30 skew-x-12 -z-10 blur-3xl pointer-events-none"
        aria-hidden
      />
      <section className="w-full max-w-4xl grid md:grid-cols-12 gap-0 overflow-hidden rounded-xl bg-surface-container-lowest shadow-ambient">
        <aside className="md:col-span-4 bg-surface-container flex flex-col items-center justify-center p-12 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none bg-[repeating-linear-gradient(45deg,var(--color-outline-variant)_0,var(--color-outline-variant)_1px,transparent_1px,transparent_10px)]"
            aria-hidden
          />
          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            <Logo size="lg" variant="compact" />
            {side}
          </div>
        </aside>
        <div className="md:col-span-8 p-8 md:p-16 bg-surface-container-low flex flex-col gap-12">
          <header className="space-y-2">
            <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight leading-tight">
              {title}
            </h1>
            {description ? (
              <p className="text-on-surface-variant font-medium">
                {description}
              </p>
            ) : null}
          </header>
          {children}
        </div>
      </section>
    </main>
  );
};
