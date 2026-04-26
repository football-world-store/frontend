"use client";

import { EntriesTemplate } from "@/components/templates";
import { useAuth } from "@/contexts";
import { useProductsQuery } from "@/hooks/queries";

const EntriesPage = () => {
  const { user } = useAuth();
  const { data: products } = useProductsQuery();

  return <EntriesTemplate user={user} products={products ?? []} />;
};

export default EntriesPage;
