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

const yearlySales = [
  { month: "01", sales: 1200 },
  { month: "02", sales: 3340 },
  { month: "03", sales: 1110 },
  { month: "04", sales: 2230 },
  { month: "05", sales: 4550 },
  { month: "06", sales: 3330 },
  { month: "07", sales: 6620 },
  { month: "08", sales: 2022 },
  { month: "09", sales: 3110 },
  { month: "10", sales: 6520 },
  { month: "11", sales: 4620 },
  { month: "12", sales: 1240 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#9ca3af",
  },
} satisfies ChartConfig

export function YearlyBarChart({ data } : { data : {month : string, sales : number}[]}) {
  return (
    <Card className="h-full w-full flex flex-col">
      <CardHeader className="px-4 pb-1">
        <CardTitle className="text-sm">Yearly Sales</CardTitle>
        <CardDescription className="text-xs">Jan - Dec 2025</CardDescription>
      </CardHeader>

      <CardContent className="px-2 pb-2 pt-1 h-[180px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, bottom: 10, left: 0, right: 0 }}
              barSize={40}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={6}
                axisLine={false}
                tickFormatter={(value) => {
                  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  return months[parseInt(value) - 1];
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="sales"
                 fill="#059669"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}