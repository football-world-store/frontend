import type { Metadata, Viewport } from "next";
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
  title: {
    default: "Football World Store",
    template: "%s | Football World Store",
  },
  description:
    "Gerencie estoque, vendas, reservas e clientes da Football World Store — painel operacional completo.",
  applicationName: "Football World Store",
  keywords: ["estoque", "camisas", "futebol", "loja", "gestão"],
  authors: [{ name: "Football World Store" }],
  // Painel interno (staff) + portal de pedidos do cliente — não é a loja
  // pública, então não deve ser indexado por buscadores.
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Football World Store",
    description: "Painel operacional da Football World Store.",
    type: "website",
    locale: "pt_BR",
    siteName: "Football World Store",
    images: [{ url: "/brand/logo.png", width: 751, height: 751 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#131313",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${lexend.variable} ${manrope.variable} ${inter.variable} h-full antialiased`}
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
