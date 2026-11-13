"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { Avatar, Badge, Button, Icon, Modal } from "@/components/atoms";
import {
  Card,
  EmptyState,
  SkeletonCard,
  SkeletonListRow,
} from "@/components/molecules";
import { CustomerForm, CustomerPurchasesCard } from "@/components/organisms";
import { DashboardLayout } from "@/components/templates";
import { useCustomerQuery } from "@/hooks/queries";
import { formatDateBR, formatPriceFromReais } from "@/utils";

const STATUS_LABEL = {
  ACTIVE: "MVP — cliente ativo",
  COOLING: "Esfriando",
  INACTIVE: "Sumido",
} as const;

const buildWhatsappLink = (phone: string | null) => {
  if (!phone) return null;
  const normalized = phone.replace(/\D/g, "");
  return normalized ? `https://wa.me/${normalized}` : null;
};

const CustomerDetailPage = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { data: customer, isLoading } = useCustomerQuery(id);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return (
      <DashboardLayout
        title={
          <>
            Ficha do <span className="text-primary italic">Campeão</span>
          </>
        }
        subtitle="Carregando ficha…"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SkeletonCard tier="container-high" bodyLines={3} />
            <SkeletonCard bodyLines={2} />
            <Card title="Últimos pedidos" description="Histórico recente">
              <SkeletonListRow count={3} />
            </Card>
          </div>
          <div className="space-y-6">
            <SkeletonCard tier="container-high" bodyLines={5} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!customer) {
    return (
      <DashboardLayout title="Cliente" subtitle="Não encontrado">
        <Card>
          <EmptyState
            iconName="person_off"
            title="Cliente não encontrado"
            description="Verifique se o link está correto ou volte para a lista de clientes."
          />
        </Card>
      </DashboardLayout>
    );
  }

  const whatsappLink = buildWhatsappLink(customer.phone);
  const averageTicket =
    customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0;

  return (
    <DashboardLayout
      title={
        <>
          Ficha do <span className="text-primary italic">Campeão</span>
        </>
      }
      subtitle="Detalhes do perfil e oportunidades de relacionamento."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card tier="container-high">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <Avatar name={customer.name} className="h-20 w-20 text-2xl" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">
                    {customer.name}
                  </h2>
                  <Badge tone="primary">{STATUS_LABEL[customer.status]}</Badge>
                </div>
                <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
                  {customer.email ?? customer.phone ?? "Sem contato"}
                </p>
                <p className="font-body text-sm text-on-surface-variant">
                  Cliente desde {formatDateBR(customer.createdAt)}
                </p>
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
                  <Icon name="edit" size="sm" filled={false} />
                  Editar perfil
                </Button>
                {whatsappLink ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-tertiary-container text-on-tertiary px-4 py-2 font-label uppercase text-xs font-semibold tracking-wider hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-focus-gold"
                  >
                    <Icon name="forum" size="sm" />
                    WhatsApp direto
                  </a>
                ) : null}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card tier="container-highest" title="Cliente desde">
              <strong className="font-headline text-xl font-extrabold text-on-surface">
                {formatDateBR(customer.createdAt)}
              </strong>
            </Card>
            <Card tier="container-highest" title="Ticket médio">
              <strong className="font-headline text-xl font-extrabold text-on-surface">
                {customer.totalOrders > 0
                  ? formatPriceFromReais(averageTicket)
                  : "—"}
              </strong>
            </Card>
            <Card tier="container-highest" title="Total gasto">
              <strong className="font-headline text-xl font-extrabold text-primary">
                {formatPriceFromReais(customer.totalSpent)}
              </strong>
            </Card>
          </div>

          <CustomerPurchasesCard customerId={customer.id} />
        </div>

        <div className="space-y-6">
          <Card tier="container-high" title="Resumo">
            <ul className="space-y-3">
              <li className="flex items-center justify-between font-body text-sm">
                <span className="text-on-surface-variant">
                  Total de pedidos
                </span>
                <strong className="text-on-surface font-semibold">
                  {customer.totalOrders}
                </strong>
              </li>
              <li className="flex items-center justify-between font-body text-sm">
                <span className="text-on-surface-variant">Última compra</span>
                <strong className="text-on-surface font-semibold">
                  {customer.lastPurchaseAt
                    ? formatDateBR(customer.lastPurchaseAt)
                    : "—"}
                </strong>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar cliente"
        description={customer.name}
        size="lg"
      >
        <CustomerForm
          customer={customer}
          onSuccess={() => setIsEditOpen(false)}
          onCancel={() => setIsEditOpen(false)}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CustomerDetailPage;
