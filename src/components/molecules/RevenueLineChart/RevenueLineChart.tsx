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

import {
  CHART_AXIS_COLOR,
  CHART_GRID_COLOR,
  CHART_PALETTE,
  CHART_TOOLTIP_STYLE,
} from "@/constants";
import { formatCurrencyBRL } from "@/utils";

interface RevenueLineChartProps {
  data: { date: string; revenue: number; cost: number }[];
}

const AXIS_TICK = { fill: CHART_AXIS_COLOR, fontSize: 11 };

export const RevenueLineChart = ({ data }: RevenueLineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={data}
        margin={{ top: 16, right: 16, bottom: 0, left: 0 }}
      >
        <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
        <XAxis
          dataKey="date"
          tick={AXIS_TICK}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={AXIS_TICK}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value: number) =>
            value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value)
          }
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          formatter={(value) =>
            formatCurrencyBRL(Number(value) * 100) as unknown as string
          }
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={CHART_PALETTE.primary}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="cost"
          stroke={CHART_PALETTE.tertiary}
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
