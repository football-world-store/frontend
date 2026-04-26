"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CHART_AXIS_COLOR,
  CHART_SERIES_COLORS,
  CHART_TOOLTIP_STYLE,
} from "@/constants";
import { formatCurrencyBRL } from "@/utils";

interface SalesByChannelChartProps {
  data: { channel: string; total: number }[];
}

export const SalesByChannelChart = ({ data }: SalesByChannelChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 12, right: 0, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="channel"
          tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          formatter={(value) =>
            formatCurrencyBRL(Number(value) * 100) as unknown as string
          }
        />
        <Bar dataKey="total" radius={[8, 8, 0, 0]}>
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
