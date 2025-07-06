"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A pie chart with a custom label"

const chartData = [
  { browser: "Sizzling", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "Unli", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "Pulutan", visitors: 173, fill: "var(--color-edge)" },
  { browser: "Drinks", visitors: 90, fill: "var(--color-other)" },
]
const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Sizzling",
      color: "#d1d5db", // gray-300
    },
    safari: {
      label: "Unli",
      color: "#9ca3af", // gray-400
    },
    firefox: {
      label: "Pulutan",
      color: "#6b7280", // gray-500
    },
    edge: {
      label: "Drinks",
      color: "#4b5563", // gray-600
    },
    other: {
      label: "Other",
      color: "#374151", // gray-700
    },
  } satisfies ChartConfig
  

export function CategoryPieChart() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="items-center pb-1">
        <CardTitle className="text-sm"> Category Pie Chart </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 px-2 py-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <PieChart width={256} height={200}>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              outerRadius="80%"
              labelLine={false}
              label={({ payload, ...props }) => (
                <text
                  cx={props.cx}
                  cy={props.cy}
                  x={props.x}
                  y={props.y}
                  textAnchor={props.textAnchor}
                  dominantBaseline={props.dominantBaseline}
                  fill="hsla(var(--foreground))"
                  fontSize={12}
                >
                  {payload.browser}
                </text>
              )}
              nameKey="browser"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

    
    </Card>
  )
}
