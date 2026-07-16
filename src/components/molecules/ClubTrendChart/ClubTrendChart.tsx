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

import type { DashboardClubTrend } from "@/types";

interface ClubTrendChartProps {
  clubs: DashboardClubTrend[];
}

const PALETTE = ["#f2ca50", "#d4af37", "#bfcdff", "#97b0ff", "#e9c349"];

interface ChartRow {
  month: string;
  [clubOrBrand: string]: string | number;
}

const buildChartRows = (clubs: DashboardClubTrend[]): ChartRow[] => {
  const monthMap = new Map<string, ChartRow>();

  for (const club of clubs) {
    for (const point of club.points) {
      const row = monthMap.get(point.month) ?? { month: point.month };
      row[club.clubOrBrand] = point.totalSold;
      monthMap.set(point.month, row);
    }
  }

  return Array.from(monthMap.values()).sort((a, b) =>
    a.month.localeCompare(b.month),
  );
};

export const ClubTrendChart = ({ clubs }: ClubTrendChartProps) => {
  const rows = buildChartRows(clubs);

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
        {clubs.map((club, index) => (
          <Line
            key={club.clubOrBrand}
            type="monotone"
            dataKey={club.clubOrBrand}
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
