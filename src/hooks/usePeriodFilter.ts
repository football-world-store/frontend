import { useState } from "react";

import type { DashboardPeriod, DashboardPeriodKind } from "@/types";

export type PeriodFilterKind = DashboardPeriodKind | "CUSTOM";

const buildPeriod = (
  kind: PeriodFilterKind,
  startDate: string,
  endDate: string,
): DashboardPeriod | undefined => {
  if (kind !== "CUSTOM") return { period: kind };
  if (!startDate || !endDate) return undefined;
  return { period: "CUSTOM", startDate, endDate };
};

export const usePeriodFilter = (
  initialKind: DashboardPeriodKind = "LAST_30_DAYS",
) => {
  const [kind, setKind] = useState<PeriodFilterKind>(initialKind);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isCustom = kind === "CUSTOM";
  const isCustomReady = isCustom && Boolean(startDate && endDate);

  return {
    kind,
    setKind,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isCustom,
    isCustomReady,
    /** Pronto pra passar aos hooks de query — undefined enquanto CUSTOM não tem as duas datas. */
    period: buildPeriod(kind, startDate, endDate),
  };
};
