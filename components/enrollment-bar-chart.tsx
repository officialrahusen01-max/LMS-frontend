"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";

function shorten(s: string, n: number) {
  const t = s.trim();
  if (t.length <= n) return t;
  return `${t.slice(0, n - 1)}…`;
}

export type EnrollmentBarChartItem = { title: string; count: number };

type Props = {
  items: EnrollmentBarChartItem[];
  /** Legend / tooltip label for the value */
  valueLabel?: string;
  className?: string;
};

export function EnrollmentBarChart({
  items,
  valueLabel = "Enrollments",
  className,
}: Props) {
  const data = React.useMemo(
    () =>
      items.map((row, i) => ({
        key: `${i}-${row.title}`,
        shortLabel: shorten(row.title, 24),
        fullTitle: row.title,
        count: row.count,
      })),
    [items],
  );

  const config = React.useMemo(
    () =>
      ({
        count: {
          label: valueLabel,
          theme: {
            light: "var(--chart-1)",
            dark: "var(--chart-1)",
          },
        },
      }) satisfies ChartConfig,
    [valueLabel],
  );

  if (items.length === 0) return null;

  return (
    <ChartContainer config={config} className={className ?? "aspect-auto h-[min(380px,52vh)] w-full"}>
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ left: 4, right: 12, top: 8, bottom: 8 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border/40" />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          allowDecimals={false}
          domain={[0, "dataMax + 1"]}
        />
        <YAxis
          type="category"
          dataKey="shortLabel"
          tickLine={false}
          axisLine={false}
          width={112}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip
          cursor={{ fill: "rgba(127, 127, 127, 0.12)" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const row = payload[0].payload as { fullTitle: string; count: number };
            return (
              <div className="rounded-lg border border-border/60 bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
                <p className="max-w-[240px] font-medium leading-snug text-foreground">{row.fullTitle}</p>
                <p className="mt-1 tabular-nums text-muted-foreground">
                  {valueLabel}: <span className="font-semibold text-foreground">{row.count}</span>
                </p>
              </div>
            );
          }}
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={[0, 6, 6, 0]} maxBarSize={28} />
      </BarChart>
    </ChartContainer>
  );
}
