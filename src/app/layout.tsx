import type { Metadata } from "next";
import { Inter, Lexend, Manrope } from "next/font/google";

import { Providers } from "./providers";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Football World Store",
  description: "A loja oficial dos torcedores apaixonados.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html
      lang="pt-BR"
      className={`dark ${lexend.variable} ${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* next/font não suporta os axes variáveis do Material Symbols. Carregamos via link global no root layout — fica em todas as páginas, não é um custom-font por página. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-surface text-on-surface font-body min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
