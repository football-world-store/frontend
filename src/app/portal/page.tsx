"use client";

import { useState } from "react";

import {
  CustomerLoginForm,
  RegisterCustomerForm,
  RequestMagicLinkForm,
} from "@/components/organisms";
import { AuthLayout } from "@/components/templates";

type Tab = "login" | "register" | "magic-link";

const TABS: { id: Tab; label: string }[] = [
  { id: "login", label: "Entrar" },
  { id: "register", label: "Criar conta" },
  { id: "magic-link", label: "Link mágico" },
];

const DESCRIPTIONS: Record<Tab, string> = {
  login: "Acesse seus pedidos com seu email e senha.",
  register: "Crie uma conta para acompanhar seus pedidos.",
  "magic-link": "Informe seu email e enviaremos um link de acesso — sem senha.",
};

const PortalPage = () => {
  const [tab, setTab] = useState<Tab>("login");

  return (
    <AuthLayout
      title={
        <>
          Acesse seus <span className="text-primary italic">pedidos</span>
        </>
      }
      description={DESCRIPTIONS[tab]}
      side={
        <p className="font-label text-on-surface-variant text-xs uppercase tracking-widest">
          Elite Performance Tier
        </p>
      }
    >
      <nav className="flex gap-1 p-1 rounded-lg bg-surface-container-lowest border border-outline-variant">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={[
              "flex-1 py-2 px-3 rounded-md font-label text-sm font-medium transition-colors",
              tab === id
                ? "bg-metallic text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "login" && <CustomerLoginForm />}
      {tab === "register" && <RegisterCustomerForm />}
      {tab === "magic-link" && <RequestMagicLinkForm />}
    </AuthLayout>
  );
};

export default PortalPage;
