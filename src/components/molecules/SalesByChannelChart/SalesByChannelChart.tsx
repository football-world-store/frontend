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

import { formatCurrencyBRL } from "@/utils";

interface SalesByChannelChartProps {
  data: { channel: string; total: number }[];
}

const CHANNEL_COLORS = ["#f2ca50", "#d4af37", "#bfcdff"];

export const SalesByChannelChart = ({ data }: SalesByChannelChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 12, right: 0, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="channel"
          tick={{ fill: "#d0c5af", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            background: "var(--color-surface-bright)",
            border: "none",
            borderRadius: 8,
            color: "var(--color-on-surface)",
          }}
          formatter={(value) =>
            formatCurrencyBRL(Number(value) * 100) as unknown as string
          }
        />
        <Bar dataKey="total" radius={[8, 8, 0, 0]}>
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
