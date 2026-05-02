"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Avatar,
  Badge,
  Button,
  Icon,
  IconButton,
  Modal,
  Spinner,
} from "@/components/atoms";
import { Card, EmptyState } from "@/components/molecules";
import { CustomerForm } from "@/components/organisms/CustomerForm";
import { APP_ROUTES } from "@/constants";
import { useCustomersQuery } from "@/hooks/queries";
import type { Customer } from "@/types";
import { formatCurrencyBRL } from "@/utils";

const PRICE_CENTS_MULTIPLIER = 100;

const STATUS_TONE = {
  ACTIVE: "success",
  COOLING: "warning",
  INACTIVE: "neutral",
} as const;

const STATUS_LABEL = {
  ACTIVE: "Ativo",
  COOLING: "Esfriando",
  INACTIVE: "Sumido",
} as const;

type TabKey = "all" | "active" | "vip";

const VIP_THRESHOLD = 2000;

const matchesTab = (tab: TabKey, customer: Customer): boolean => {
  if (tab === "active") return customer.status === "ACTIVE";
  if (tab === "vip") return customer.totalSpent >= VIP_THRESHOLD;
  return true;
};

const buildWhatsappLink = (phone: string | null) => {
  if (!phone) return null;
  const normalized = phone.replace(/\D/g, "");
  return normalized ? `https://wa.me/${normalized}` : null;
};

export const CustomersList = () => {
  const { data, isLoading } = useCustomersQuery();
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const customers: Customer[] = (data as { items?: Customer[] })?.items ?? [];

  const ranking = useMemo(
    () =>
      [...customers]
        .sort((a: Customer, b: Customer) => b.totalSpent - a.totalSpent)
        .slice(0, 3),
    [customers],
  );

  const averageTicket = useMemo(() => {
    const orders = customers.reduce(
      (sum: number, c: Customer) => sum + c.totalOrders,
      0,
    );
    if (orders === 0) return 0;
    const spent = customers.reduce(
      (sum: number, c: Customer) => sum + c.totalSpent,
      0,
    );
    return spent / orders;
  }, [customers]);

  const filtered = useMemo(
    () =>
      customers
        .filter((customer: Customer) => matchesTab(tab, customer))
        .filter((customer: Customer) =>
          search
            ? customer.name.toLowerCase().includes(search.toLowerCase())
            : true,
        ),
    [customers, tab, search],
  );

  if (isLoading) {
    return (
      <Card title="Gestão de Elite">
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card
            tier="container-highest"
            title="Ranking de Elite"
            description="Top 3 do faturamento"
          >
            <ol className="space-y-3">
              {ranking.length === 0 ? (
                <li className="font-label text-xs text-on-surface-variant">
                  Sem dados suficientes.
                </li>
              ) : null}
              {ranking.map((customer, index) => (
                <li
                  key={customer.id}
                  className="flex items-center gap-3 bg-surface-container-low rounded-xl px-3 py-3"
                >
                  <span className="font-headline text-2xl font-extrabold text-primary w-8">
                    {index + 1}
                  </span>
                  <Avatar name={customer.name} />
                  <div className="flex-1">
                    <p className="font-body text-sm font-semibold text-on-surface">
                      {customer.name}
                    </p>
                    <p className="font-label text-xs text-on-surface-variant">
                      {customer.totalOrders} pedidos
                    </p>
                  </div>
                  <span className="font-body text-sm font-semibold text-primary">
                    {formatCurrencyBRL(
                      customer.totalSpent * PRICE_CENTS_MULTIPLIER,
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </Card>
          <Card title="Ticket médio mensal">
            <strong className="font-headline text-3xl font-extrabold text-on-surface">
              {formatCurrencyBRL(averageTicket * PRICE_CENTS_MULTIPLIER)}
            </strong>
            <p className="font-label text-xs text-on-surface-variant mt-2">
              Em pedidos confirmados
            </p>
          </Card>
        </div>

        <Card
          className="lg:col-span-2"
          tier="container-high"
          title="Gestão de Elite"
          description="Controle de performance e ranking de clientes."
          action={
            <Button onClick={() => setIsModalOpen(true)}>
              <Icon name="add" size="sm" />
              Novo cliente
            </Button>
          }
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <div className="flex gap-2">
              {(
                [
                  { key: "all", label: "Todos" },
                  { key: "active", label: "Ativos" },
                  { key: "vip", label: "VIP" },
                ] as const
              ).map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setTab(option.key)}
                  aria-pressed={tab === option.key}
                  className={`rounded-pill px-4 py-2 font-label text-xs uppercase tracking-wider font-semibold transition-colors focus-visible:outline-none focus-visible:ring-focus-gold ${
                    tab === option.key
                      ? "bg-metallic text-on-primary"
                      : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="relative md:w-72">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <Icon name="search" size="sm" />
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cliente..."
                className="w-full h-10 pl-11 pr-4 rounded-xl bg-surface-container-lowest text-on-surface text-sm focus-visible:outline-none focus-visible:ring-focus-gold"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              iconName="groups"
              title="Sem clientes"
              description="Cadastre o primeiro cliente para começar."
            />
          ) : (
            <ul className="space-y-2">
              {filtered.map((customer: Customer) => {
                const whatsappLink = buildWhatsappLink(customer.phone);
                const isVip = customer.totalSpent >= VIP_THRESHOLD;
                return (
                  <li
                    key={customer.id}
                    className="bg-surface-container-low rounded-xl px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2 hover:bg-surface-bright transition-colors"
                  >
                    <Avatar name={customer.name} />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={APP_ROUTES.app.customerDetail(customer.id)}
                        className="font-body text-sm font-semibold text-on-surface hover:text-primary transition-colors"
                      >
                        {customer.name}
                      </Link>
                      <p className="font-label text-xs text-on-surface-variant truncate">
                        {customer.phone ?? customer.email ?? "Sem contato"}
                      </p>
                    </div>
                    <div className="ml-auto flex-shrink-0 flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="font-label text-xs text-on-surface-variant">
                          Total gasto
                        </p>
                        <p className="font-body text-sm font-semibold text-on-surface">
                          {formatCurrencyBRL(
                            customer.totalSpent * PRICE_CENTS_MULTIPLIER,
                          )}
                        </p>
                      </div>
                      <Badge
                        tone={
                          STATUS_TONE[
                            customer.status as keyof typeof STATUS_TONE
                          ]
                        }
                      >
                        {
                          STATUS_LABEL[
                            customer.status as keyof typeof STATUS_LABEL
                          ]
                        }
                      </Badge>
                      {isVip ? <Badge tone="primary">VIP</Badge> : null}
                      {whatsappLink ? (
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Conversar no WhatsApp"
                          className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-tertiary-container text-on-tertiary hover:opacity-90 transition-opacity"
                        >
                          <Icon name="forum" size="md" />
                        </a>
                      ) : (
                        <IconButton
                          iconName="forum"
                          label="Sem telefone"
                          disabled
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar cliente"
        description="Adicione um novo cliente à base."
        size="lg"
      >
        <CustomerForm
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};
