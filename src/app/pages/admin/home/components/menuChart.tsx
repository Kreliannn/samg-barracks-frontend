"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "unli wings", desktop: 100 },
  { month: "meal 1", desktop: 200 },
  { month: "sisig", desktop: 400 },
  { month: "chicken", desktop: 500 },
  { month: "cola", desktop: 600 },
  { month: "bbq", desktop: 700 },
  { month: "adobo", desktop: 800 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#9ca3af",
  },
} satisfies ChartConfig

export function MenuyBarChart() {
  return (
    <Card className="h-full w-full flex flex-col">
      <CardHeader className="px-4 pb-1">
        <CardTitle className="text-sm">Top Sales Menu</CardTitle>
        <CardDescription className="text-xs">from lowest to highest</CardDescription>
      </CardHeader>

      {/* Set specific height to let everything fit */}
      <CardContent className="px-2 pb-2 pt-1 h-[180px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, bottom: 10, left: 0, right: 0 }}
              barSize={40}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={6}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                  dataKey="desktop"
                  fill="var(--color-desktop)"
                  radius={[6, 6, 0, 0]} // keep your rounded corners
                  barSize={100}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
