"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

import { Icon, Logo } from "@/components/atoms";
import { ReceiptPage } from "@/components/organisms";
import { APP_ROUTES, queryKeys } from "@/constants";
import { useCustomerLogoutMutation } from "@/hooks/mutations";
import { useCustomerOrderQuery } from "@/hooks/queries";
import type { AuthUser, CustomerIdentity } from "@/types";

const CustomerOrderReceiptPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutMutation = useCustomerLogoutMutation();
  const id = params?.id ?? "";
  const query = useCustomerOrderQuery(id);
  const user = queryClient.getQueryData<AuthUser>(queryKeys.user.me());
  const customer = queryClient.getQueryData<CustomerIdentity>(
    queryKeys.customerAuth.identity(),
  );
  const name = user?.name ?? customer?.name ?? "Cliente";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-surface font-body text-on-surface lg:flex">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-outline-variant bg-surface-container-low px-6 py-8 lg:flex">
        <Link href={APP_ROUTES.portal.root} className="mb-12 flex items-center">
          <Logo size="md" className="h-16 w-44" />
        </Link>
        <nav aria-label="Navegação do portal" className="space-y-2">
          <Link
            href={APP_ROUTES.portal.orders}
            aria-current="page"
            className="flex items-center gap-3 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-sm"
          >
            <Icon name="receipt_long" size="sm" /> Meus pedidos
          </Link>
          <Link
            href={APP_ROUTES.portal.reservations}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <Icon name="event_available" size="sm" /> Minhas reservas
          </Link>
        </nav>
        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-surface-container p-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-metallic font-headline text-sm font-bold text-on-primary">
              {initials}
            </span>
            <p className="truncate text-sm font-semibold">{name}</p>
          </div>
          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-error-container"
          >
            <Icon name="logout" size="sm" /> Sair
          </button>
        </div>
      </aside>
      <section className="min-w-0 flex-1">
        <ReceiptPage
          sale={query.data}
          isLoading={query.isPending}
          isError={query.isError}
          onBack={() => router.push(APP_ROUTES.portal.orders)}
          backLabel="Voltar para meus pedidos"
        />
      </section>
    </main>
  );
};

export default CustomerOrderReceiptPage;
