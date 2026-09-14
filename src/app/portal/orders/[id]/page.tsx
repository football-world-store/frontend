"use client";

import { useParams, useRouter } from "next/navigation";

import { ReceiptPage } from "@/components/organisms";
import { APP_ROUTES } from "@/constants";
import { useCustomerOrderQuery } from "@/hooks/queries";

const CustomerOrderReceiptPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id ?? "";
  const query = useCustomerOrderQuery(id);

  return (
    <ReceiptPage
      sale={query.data}
      isLoading={query.isPending}
      isError={query.isError}
      onBack={() => router.push(APP_ROUTES.portal.orders)}
      backLabel="Voltar para meus pedidos"
    />
  );
};

export default CustomerOrderReceiptPage;
