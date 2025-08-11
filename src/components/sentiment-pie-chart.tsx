'use client';

import * as React from 'react';
import { Pie, PieChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
}

interface SentimentPieChartProps {
  data: SentimentData;
}

const chartConfig = {
  positive: {
    label: 'Positive',
    color: 'hsl(var(--chart-1))',
  },
  negative: {
    label: 'Negative',
    color: 'hsl(var(--chart-2))',
  },
  neutral: {
    label: 'Neutral',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export default function SentimentPieChart({ data }: SentimentPieChartProps) {
  const chartData = [
    { name: 'positive', value: data.positive, fill: 'var(--color-positive)' },
    { name: 'negative', value: data.negative, fill: 'var(--color-negative)' },
    { name: 'neutral', value: data.neutral, fill: 'var(--color-neutral)' },
  ].filter(d => d.value > 0);

  const total = data.positive + data.negative + data.neutral;
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        No data to display
      </div>
    )
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-full max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel indicator="dot" formatter={(value, name) => `${(value).toFixed(1)}%`} />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        />
      </PieChart>
    </ChartContainer>
  );
}
