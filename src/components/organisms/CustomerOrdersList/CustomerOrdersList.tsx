"use client";

import { useRouter } from "next/navigation";

import { Badge, Icon, Spinner } from "@/components/atoms";
import { Card, EmptyState } from "@/components/molecules";
import { useCustomerOrdersQuery } from "@/hooks/queries";
import type { CustomerReservation, Sale } from "@/types";
import { formatDateBR, formatPriceFromReais, zebraRowTier } from "@/utils";

const SALE_STATUS: Record<
  Sale["status"],
  { label: string; tone: "success" | "neutral" }
> = {
  CONFIRMED: { label: "Confirmado", tone: "success" },
  CANCELLED: { label: "Cancelado", tone: "neutral" },
};
const RESERVATION_STATUS: Record<
  CustomerReservation["status"],
  { label: string; tone: "success" | "neutral" | "error" }
> = {
  PENDING: { label: "Pendente", tone: "neutral" },
  CONFIRMED: { label: "Confirmada", tone: "success" },
  CANCELLED: { label: "Cancelada", tone: "neutral" },
  EXPIRED: { label: "Expirada", tone: "error" },
};

const PurchasesSection = ({
  purchases,
  onSelect,
}: {
  purchases: Sale[];
  onSelect: (id: string) => void;
}) => (
  <Card
    title="Compras"
    description="Seu histórico de pedidos"
    action={
      <span className="grid size-9 place-items-center rounded-xl bg-primary-container text-on-primary-container">
        <Icon name="shopping_bag" size="sm" />
      </span>
    }
  >
    {purchases.length === 0 ? (
      <EmptyState
        iconName="shopping_bag"
        title="Você ainda não possui compras"
        description="Quando uma venda for registrada com seu email, ela aparecerá aqui."
      />
    ) : (
      <ul className="space-y-3">
        {purchases.map((sale, index) => {
          const status = SALE_STATUS[sale.status];
          return (
            <li key={sale.id}>
              <button
                type="button"
                onClick={() => onSelect(sale.id)}
                className={`group flex w-full items-center justify-between gap-4 rounded-xl border border-outline-variant/60 px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-focus-gold ${zebraRowTier(index)}`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-container-highest text-primary">
                    <Icon name="receipt_long" size="sm" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      Pedido #{sale.saleNumber}
                    </span>
                    <span className="mt-1 block text-xs text-on-surface-variant">
                      {formatDateBR(sale.saleDate)} · {sale.items.length}{" "}
                      {sale.items.length === 1 ? "item" : "itens"}
                    </span>
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="hidden text-right sm:block">
                    <span className="block text-sm font-bold">
                      {formatPriceFromReais(sale.totalAmount)}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      ver recibo
                    </span>
                  </span>
                  <Badge tone={status.tone}>{status.label}</Badge>
                  <Icon
                    name="chevron_right"
                    size="sm"
                    className="text-on-surface-variant transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    )}
  </Card>
);

const ReservationsSection = ({
  reservations,
}: {
  reservations: CustomerReservation[];
}) => (
  <section id="reservas" className="scroll-mt-6">
    <Card
      title="Reservas"
      description="Produtos reservados para você"
      action={
        <span className="grid size-9 place-items-center rounded-xl bg-secondary-container text-on-secondary-container">
          <Icon name="event_available" size="sm" />
        </span>
      }
    >
      {reservations.length === 0 ? (
        <EmptyState
          iconName="event_available"
          title="Nenhuma reserva ativa"
          description="Suas reservas feitas na loja aparecerão aqui."
        />
      ) : (
        <ul className="space-y-3">
          {reservations.map((reservation, index) => {
            const status = RESERVATION_STATUS[reservation.status];
            return (
              <li
                key={reservation.id}
                className={`flex items-center justify-between gap-4 rounded-xl border border-outline-variant/60 px-4 py-4 ${zebraRowTier(index)}`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary-container text-on-secondary-container">
                    <Icon name="inventory_2" size="sm" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {reservation.productName}
                    </span>
                    <span className="mt-1 block text-xs text-on-surface-variant">
                      Tamanho {reservation.size} · {reservation.quantity}x ·
                      criada em {formatDateBR(reservation.createdAt)}
                    </span>
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <Badge tone={status.tone}>{status.label}</Badge>
                  <span className="mt-1 block text-[0.65rem] text-on-surface-variant">
                    Expira em {formatDateBR(reservation.expiresAt)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  </section>
);

export const CustomerOrdersList = () => {
  const query = useCustomerOrdersQuery();
  const router = useRouter();
  if (query.isPending)
    return (
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="h-64">
          <div className="flex h-full items-center justify-center">
            <Spinner size="lg" tone="primary" />
          </div>
        </Card>
        <Card className="h-64">
          <div className="flex h-full items-center justify-center">
            <Spinner size="lg" tone="primary" />
          </div>
        </Card>
      </div>
    );
  if (query.isError)
    return (
      <Card className="border border-error/30">
        <EmptyState
          iconName="lock"
          title="Sessão expirada"
          description="Entre novamente para consultar suas compras e reservas."
          action={
            <a
              href="/sign-in"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
            >
              Entrar novamente <Icon name="arrow_forward" size="sm" />
            </a>
          }
        />
      </Card>
    );
  const { purchases = [], reservations = [] } = query.data ?? {};
  const totalSpent = purchases.reduce((sum, sale) => sum + sale.totalAmount, 0);
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="!p-4">
          <p className="text-xs text-on-surface-variant">Pedidos realizados</p>
          <p className="mt-1 font-headline text-2xl font-extrabold">
            {purchases.length}
          </p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs text-on-surface-variant">Total comprado</p>
          <p className="mt-1 font-headline text-2xl font-extrabold text-primary">
            {formatPriceFromReais(totalSpent)}
          </p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs text-on-surface-variant">Reservas ativas</p>
          <p className="mt-1 font-headline text-2xl font-extrabold">
            {
              reservations.filter(
                (item) =>
                  item.status === "PENDING" || item.status === "CONFIRMED",
              ).length
            }
          </p>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <PurchasesSection
          purchases={purchases}
          onSelect={(id) => router.push(`/portal/orders/${id}`)}
        />
        <ReservationsSection reservations={reservations} />
      </div>
    </div>
  );
};

export const CustomerReservationsList = () => {
  const query = useCustomerOrdersQuery();
  if (query.isPending) {
    return (
      <Card className="h-64">
        <div className="flex h-full items-center justify-center">
          <Spinner size="lg" tone="primary" />
        </div>
      </Card>
    );
  }
  if (query.isError) {
    return (
      <Card className="border border-error/30">
        <EmptyState
          iconName="lock"
          title="Sessão expirada"
          description="Entre novamente para consultar suas reservas."
          action={
            <a
              href="/sign-in"
              className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
            >
              Entrar novamente
            </a>
          }
        />
      </Card>
    );
  }
  return <ReservationsSection reservations={query.data?.reservations ?? []} />;
};
