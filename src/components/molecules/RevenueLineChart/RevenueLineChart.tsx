"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrencyBRL } from "@/utils";

interface RevenueLineChartProps {
  data: { date: string; revenue: number; cost: number }[];
}

export const RevenueLineChart = ({ data }: RevenueLineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={data}
        margin={{ top: 16, right: 16, bottom: 0, left: 0 }}
      >
        <CartesianGrid stroke="rgba(208, 197, 175, 0.08)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: "#d0c5af", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#d0c5af", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value: number) =>
            value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value)
          }
        />
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
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#f2ca50"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="cost"
          stroke="#bfcdff"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
