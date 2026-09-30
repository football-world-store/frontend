import type { Metadata } from "next";

import { BrandsSection } from "@/components/organisms/BrandsSection";
import { CTASection } from "@/components/organisms/CTASection";
import { FeaturedProductsSection } from "@/components/organisms/FeaturedProductsSection";
import { HeroSection } from "@/components/organisms/HeroSection";
import { TestimonialsSection } from "@/components/organisms/TestimonialsSection";

const SITE_URL = "https://footballworldstore.com.br";

export const metadata: Metadata = {
  title: "Football World Store | Camisas de Futebol Premium",
  description:
    "Compre camisas de futebol originais das melhores marcas: Nike, Adidas, Puma e muito mais. Originals, retrôs e lançamentos com entrega rápida para todo o Brasil.",
  keywords: [
    "camisas de futebol",
    "camisas originais",
    "futebol",
    "Nike futebol",
    "Adidas futebol",
    "Flamengo",
    "Palmeiras",
    "loja de futebol",
    "camisas de time",
    "football store",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/home` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${SITE_URL}/home`,
    siteName: "Football World Store",
    title: "Football World Store | Camisas de Futebol Premium",
    description:
      "Camisas originais das maiores marcas do futebol mundial. Entrega rápida e autenticidade garantida.",
    images: [
      {
        url: `${SITE_URL}/brand/logo.png`,
        width: 751,
        height: 751,
        alt: "Football World Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Football World Store | Camisas de Futebol Premium",
    description: "Camisas originais das maiores marcas do futebol mundial.",
    images: [`${SITE_URL}/brand/logo.png`],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Football World Store",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo.png`,
  description:
    "Loja especializada em camisas de futebol originais das maiores marcas do mundo.",
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Football World Store",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/portal?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const HomePage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationJsonLd, webSiteJsonLd]),
        }}
      />
      <main>
        <HeroSection />
        <FeaturedProductsSection />
        <BrandsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </>
  );
};

export default HomePage;
