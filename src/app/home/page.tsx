import type { Metadata } from "next";

import { AcaiSection } from "@/components/organisms/AcaiSection";
import { AnnouncementBar } from "@/components/organisms/AnnouncementBar";
import { BrandsSection } from "@/components/organisms/BrandsSection";
import { CTASection } from "@/components/organisms/CTASection";
import { FeaturedProductsSection } from "@/components/organisms/FeaturedProductsSection";
import { HeroSection } from "@/components/organisms/HeroSection";
import { LocationSection } from "@/components/organisms/LocationSection";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { SiteHeader } from "@/components/organisms/SiteHeader";

const SITE_URL = "https://footballworldstore.com.br";
const PAGE_URL = `${SITE_URL}/home`;

export const metadata: Metadata = {
  title: "Football World Store | Camisas de Futebol e Açaí",
  description:
    "Compre camisas de futebol originais das melhores marcas: Nike, Adidas, Puma e muito mais, e peça seu açaí montado do seu jeito. Originals, retrôs, lançamentos e açaí com entrega rápida.",
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
    "açaí",
    "açaí da toca",
    "Macaúbas",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: PAGE_URL,
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

const sportingGoodsStoreJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportingGoodsStore",
  name: "Football World Store",
  url: PAGE_URL,
  logo: `${SITE_URL}/brand/logo.png`,
  telephone: "+5577997011339",
  description:
    "Loja especializada em camisas de futebol originais das maiores marcas do mundo, com serviço próprio de açaí montado sob pedido.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Galeria Umbuzeiros, Praça Imaculada Conceição",
    addressLocality: "Macaúbas",
    addressRegion: "BA",
    postalCode: "46500-000",
    addressCountry: "BR",
  },
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Football World Store",
  url: PAGE_URL,
};

const PublicHomePage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([sportingGoodsStoreJsonLd, webSiteJsonLd]),
        }}
      />
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturedProductsSection />
        <BrandsSection />
        <AcaiSection />
        <LocationSection />
        <CTASection />
      </main>
      <SiteFooter />
    </>
  );
};

export default PublicHomePage;
