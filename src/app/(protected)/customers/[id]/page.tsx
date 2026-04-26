"use client";

import { useParams } from "next/navigation";

import { Avatar, Badge, Button, Icon, Spinner } from "@/components/atoms";
import { Card, EmptyState } from "@/components/molecules";
import { DashboardLayout } from "@/components/templates";
import { useCustomerQuery } from "@/hooks/queries";
import { formatCurrencyBRL, formatDateBR } from "@/utils";

const PRICE_CENTS_MULTIPLIER = 100;

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

const RECENT_ORDERS = [
  {
    id: "o-001",
    productName: "Camisa Flamengo Retrô 1981",
    soldAt: "2025-10-15",
    total: 249,
  },
  {
    id: "o-002",
    productName: "Agasalho Treino Elite Panther",
    soldAt: "2025-10-02",
    total: 420,
  },
];

const SMART_LISTS = [
  {
    id: "list-1",
    name: "Flamengo Fans",
    description: "Público com afinidade ao Flamengo. Conversão histórica 18%.",
  },
  {
    id: "list-2",
    name: "Size G Users",
    description: "Clientes com perfil tamanho G. Aumenta CTR em mailings.",
  },
  {
    id: "list-3",
    name: "Inactive 30+ days",
    description: "Reengajamento prioritário. Ofereça cupom VIP.",
  },
];

const CustomerDetailPage = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { data, isLoading } = useCustomerQuery(id);

  if (isLoading) {
    return (
      <DashboardLayout title="Cliente" subtitle="Carregando ficha...">
        <Card>
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout title="Cliente" subtitle="Não encontrado">
        <Card>
          <EmptyState
            iconName="person_off"
            title="Cliente não encontrado"
            description="Verifique o link ou volte para a lista."
          />
        </Card>
      </DashboardLayout>
    );
  }

  const whatsappLink = buildWhatsappLink(data.phone);

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
              <Avatar name={data.name} className="h-20 w-20 text-2xl" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">
                    {data.name}
                  </h2>
                  <Badge tone="primary">{STATUS_LABEL[data.status]}</Badge>
                </div>
                <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
                  {data.email ?? data.phone ?? "Sem contato"}
                </p>
                <p className="font-body text-sm text-on-surface-variant">
                  Cliente desde {formatDateBR(data.createdAt)}
                </p>
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                <Button variant="secondary">
                  <Icon name="edit" size="sm" filled={false} />
                  Editar perfil
                </Button>
                {whatsappLink ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-tertiary-container text-on-tertiary px-4 py-2 font-label uppercase text-xs font-semibold tracking-wider hover:opacity-90 transition-opacity"
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
                {formatDateBR(data.createdAt)}
              </strong>
            </Card>
            <Card tier="container-highest" title="Ticket médio">
              <strong className="font-headline text-xl font-extrabold text-on-surface">
                {data.totalOrders
                  ? formatCurrencyBRL(
                      (data.totalSpent / data.totalOrders) *
                        PRICE_CENTS_MULTIPLIER,
                    )
                  : "—"}
              </strong>
            </Card>
            <Card tier="container-highest" title="Total gasto">
              <strong className="font-headline text-xl font-extrabold text-primary">
                {formatCurrencyBRL(data.totalSpent * PRICE_CENTS_MULTIPLIER)}
              </strong>
            </Card>
          </div>

          <Card title="Notas do consultor">
            <p className="font-body text-sm text-on-surface-variant italic">
              &ldquo;Prefere modelos retrô do ano 80/90. Sempre pergunta por
              edições limitadas antes do lançamento. Atendimento VIP.&rdquo;
            </p>
          </Card>

          <Card title="Últimos pedidos" description="Histórico recente">
            <div className="rounded-xl overflow-hidden">
              {RECENT_ORDERS.map((order, index) => (
                <div
                  key={order.id}
                  className={`grid grid-cols-12 items-center px-4 py-3 ${
                    index % 2 === 0
                      ? "bg-surface-container-low"
                      : "bg-surface-container"
                  }`}
                >
                  <span className="col-span-7 font-body text-sm text-on-surface">
                    {order.productName}
                  </span>
                  <span className="col-span-3 font-label text-xs text-on-surface-variant">
                    {formatDateBR(order.soldAt)}
                  </span>
                  <span className="col-span-2 font-body text-sm font-semibold text-on-surface text-right">
                    {formatCurrencyBRL(order.total * PRICE_CENTS_MULTIPLIER)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card
            tier="container-high"
            title="Smart Mailing Lists"
            description="Segmentações sugeridas pela IA"
          >
            <ul className="space-y-3">
              {SMART_LISTS.map((list) => (
                <li
                  key={list.id}
                  className="bg-surface-container-low rounded-xl p-4 space-y-2"
                >
                  <p className="font-body text-sm font-semibold text-on-surface">
                    {list.name}
                  </p>
                  <p className="font-label text-xs text-on-surface-variant">
                    {list.description}
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 font-label text-xs uppercase tracking-wider text-primary hover:opacity-80 transition-opacity"
                  >
                    <Icon name="content_copy" size="sm" />
                    Copiar para WhatsApp
                  </button>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Próximo aniversário no clã">
            <p className="font-body text-sm text-on-surface">
              Receba notificações quando clientes próximos fizerem aniversário
              para enviar disparos personalizados.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-surface-container-low rounded-xl p-3 text-center">
                <p className="font-headline text-2xl font-extrabold text-on-surface">
                  24,8%
                </p>
                <p className="font-label text-xs text-on-surface-variant">
                  Taxa de retorno
                </p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3 text-center">
                <p className="font-headline text-2xl font-extrabold text-on-surface">
                  128
                </p>
                <p className="font-label text-xs text-on-surface-variant">
                  Total de clientes
                </p>
              </div>
            </div>
          </Card>
          <Button className="w-full">
            <Icon name="campaign" size="sm" />
            Nova campanha
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDetailPage;
