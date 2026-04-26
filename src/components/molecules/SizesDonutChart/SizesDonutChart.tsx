"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { CHART_SERIES_COLORS, CHART_TOOLTIP_STYLE } from "@/constants";

interface SizesDonutChartProps {
  data: { size: string; percentage: number }[];
}

export const SizesDonutChart = ({ data }: SizesDonutChartProps) => {
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="60%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="percentage"
            nameKey="size"
            innerRadius={48}
            outerRadius={80}
            paddingAngle={3}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={CHART_TOOLTIP_STYLE}
            formatter={(value) => `${Number(value)}%` as unknown as string}
          />
        </PieChart>
      </ResponsiveContainer>
      <ul className="space-y-2 flex-1">
        {data.map((item, index) => (
          <li
            key={item.size}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2">
              <span
                className="block h-3 w-3 rounded-default"
                style={{
                  background:
                    CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length],
                }}
              />
              <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                {item.size}
              </span>
            </span>
            <span className="font-body text-sm font-semibold text-on-surface">
              {item.percentage}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
