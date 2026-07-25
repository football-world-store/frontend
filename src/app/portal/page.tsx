"use client";

import { useState } from "react";

import {
  RegisterCustomerForm,
  RequestMagicLinkForm,
} from "@/components/organisms";
import { AuthLayout } from "@/components/templates";

type Tab = "register" | "magic-link";

const TABS: { id: Tab; label: string }[] = [
  { id: "magic-link", label: "Entrar" },
  { id: "register", label: "Criar conta" },
];

const DESCRIPTIONS: Record<Tab, string> = {
  register: "Crie uma conta para acompanhar seus pedidos.",
  "magic-link": "Informe seu email e enviaremos um link de acesso — sem senha.",
};

const PortalPage = () => {
  const [tab, setTab] = useState<Tab>("magic-link");

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

      {tab === "register" && <RegisterCustomerForm />}
      {tab === "magic-link" && <RequestMagicLinkForm />}
    </AuthLayout>
  );
};

export default PortalPage;
