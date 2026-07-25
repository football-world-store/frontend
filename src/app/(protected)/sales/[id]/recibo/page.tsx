"use client";

import { useParams, useRouter } from "next/navigation";

import { useSaleQuery } from "@/hooks/queries";
import { ReceiptPage } from "@/components/organisms";

const SaleReceiptPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id ?? "";
  const query = useSaleQuery(id);

  return (
    <ReceiptPage
      sale={query.data}
      isLoading={query.isPending}
      isError={query.isError}
      onBack={() => router.push("/sales")}
      backLabel="Voltar para vendas"
    />
  );
};

export default SaleReceiptPage;
