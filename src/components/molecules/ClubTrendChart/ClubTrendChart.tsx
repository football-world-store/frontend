"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardClubTrendEntry } from "@/types";

interface ClubTrendChartProps {
  entries: DashboardClubTrendEntry[];
}

const PALETTE = ["#f2ca50", "#d4af37", "#bfcdff", "#97b0ff", "#e9c349"];

interface ChartRow {
  month: string;
  [clubOrBrand: string]: string | number;
}

const buildChartRows = (entries: DashboardClubTrendEntry[]): ChartRow[] => {
  const monthMap = new Map<string, ChartRow>();

  for (const entry of entries) {
    const row = monthMap.get(entry.month) ?? { month: entry.month };
    row[entry.clubOrBrand] = entry.totalSold;
    monthMap.set(entry.month, row);
  }

  return Array.from(monthMap.values()).sort((a, b) =>
    a.month.localeCompare(b.month),
  );
};

const uniqueClubs = (entries: DashboardClubTrendEntry[]): string[] => [
  ...new Set(entries.map((entry) => entry.clubOrBrand)),
];

export const ClubTrendChart = ({ entries }: ClubTrendChartProps) => {
  const rows = buildChartRows(entries);
  const clubs = uniqueClubs(entries);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={rows}
        margin={{ top: 16, right: 16, bottom: 0, left: 0 }}
      >
        <CartesianGrid stroke="rgba(208, 197, 175, 0.08)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#d0c5af", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#d0c5af", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "var(--color-surface-bright)",
            border: "none",
            borderRadius: 8,
            color: "var(--color-on-surface)",
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: "#d0c5af" }}
          iconType="circle"
        />
        {clubs.map((clubOrBrand, index) => (
          <Line
            key={clubOrBrand}
            type="monotone"
            dataKey={clubOrBrand}
            stroke={PALETTE[index % PALETTE.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
