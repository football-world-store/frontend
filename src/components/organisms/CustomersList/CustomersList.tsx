"use client";

import { useState } from "react";

import { Button, Icon, Modal } from "@/components/atoms";
import {
  Card,
  EmptyState,
  Pagination,
  SkeletonListRow,
} from "@/components/molecules";
import { CustomerForm } from "@/components/organisms/CustomerForm";
import { useDebouncedValue, useFuzzySearch } from "@/hooks";
import {
  useCustomerRankingByAmountQuery,
  useCustomersQuery,
} from "@/hooks/queries";
import type { Customer } from "@/types";
import { formatCurrencyBRL } from "@/utils";

import { CustomerRow } from "./CustomerRow";
import { CustomerTabs, type TabKey } from "./CustomerTabs";
import { RankingCard } from "./RankingCard";

const PRICE_CENTS_MULTIPLIER = 100;
const RANKING_LIMIT = 3;
const ITEMS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 300;
const FUSE_OPTIONS = { keys: ["name"], threshold: 0.35 };
const VIP_THRESHOLD = 2000;

const calculateAverageTicket = (customers: Customer[]) => {
  const orders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
  if (orders === 0) return 0;
  const spent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  return spent / orders;
};

const buildQueryParams = (
  page: number,
  tab: TabKey,
  debouncedSearch: string,
) => ({
  page,
  limit: ITEMS_PER_PAGE,
  search: debouncedSearch || undefined,
  status: tab === "active" ? ("ACTIVE" as const) : undefined,
  minSpent: tab === "vip" ? VIP_THRESHOLD : undefined,
});

const LoadingState = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="space-y-6">
      <Card
        tier="container-highest"
        title="Ranking de Elite"
        description="Top 3 do faturamento"
      >
        <SkeletonListRow count={3} withAvatar />
      </Card>
      <Card title="Ticket médio mensal">
        <SkeletonListRow count={1} withTrailingValue={false} />
      </Card>
    </div>
    <Card
      className="lg:col-span-2"
      tier="container-high"
      title="Gestão de Elite"
      description="Controle de performance e ranking de clientes."
    >
      <SkeletonListRow count={6} withAvatar />
    </Card>
  </div>
);

export const CustomersList = () => {
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const { data, isLoading } = useCustomersQuery(
    buildQueryParams(page, tab, debouncedSearch),
  );
  const { data: ranking = [], isLoading: isRankingLoading } =
    useCustomerRankingByAmountQuery(RANKING_LIMIT);

  const customers: Customer[] = data?.items ?? [];
  const pageItems = useFuzzySearch(customers, search, FUSE_OPTIONS);
  const averageTicket = calculateAverageTicket(customers);

  const handleTabChange = (nextTab: TabKey) => {
    setTab(nextTab);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (isLoading || isRankingLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <RankingCard ranking={ranking} />
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
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto"
            >
              <Icon name="add" size="sm" />
              Novo cliente
            </Button>
          }
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <CustomerTabs tab={tab} onChange={handleTabChange} />
            <div className="relative md:w-72">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <Icon name="search" size="sm" />
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Buscar cliente..."
                className="w-full h-10 pl-11 pr-4 rounded-xl bg-surface-container-lowest text-on-surface text-sm focus-visible:outline-none focus-visible:ring-focus-gold"
              />
            </div>
          </div>

          {pageItems.length === 0 ? (
            <EmptyState
              iconName="groups"
              title="Nenhum cliente encontrado"
              description="Ajuste os filtros ou cadastre um novo cliente para começar."
            />
          ) : (
            <ul className="space-y-2">
              {pageItems.map((customer) => (
                <CustomerRow key={customer.id} customer={customer} />
              ))}
            </ul>
          )}

          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 1}
            total={data?.total ?? 0}
            itemCount={pageItems.length}
            itemLabel="clientes"
            onPageChange={setPage}
          />
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
