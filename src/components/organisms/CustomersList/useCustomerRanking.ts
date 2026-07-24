import { useState } from "react";

import {
  useCustomerRankingByAmountQuery,
  useCustomerRankingByPurchasesQuery,
} from "@/hooks/queries";

import type { RankingMetric } from "./RankingCard";

const RANKING_LIMIT = 3;

export const useCustomerRanking = (isOwner: boolean) => {
  const [metric, setMetric] = useState<RankingMetric>("amount");

  const { data: byAmount = [], isLoading: isByAmountLoading } =
    useCustomerRankingByAmountQuery(RANKING_LIMIT, isOwner);
  const { data: byPurchases = [], isLoading: isByPurchasesLoading } =
    useCustomerRankingByPurchasesQuery(RANKING_LIMIT, isOwner);

  return {
    metric,
    setMetric,
    ranking: metric === "amount" ? byAmount : byPurchases,
    isLoading: isByAmountLoading || isByPurchasesLoading,
  };
};
