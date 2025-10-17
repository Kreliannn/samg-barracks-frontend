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

// Your dynamic data
const salesData = [
  {
    "category": "Sizzling",
    "sold": 5
  },
  {
    "category": "Ala carte",
    "sold": 4
  },
  {
    "category": "Beverage",
    "sold": 8
  },
  {
    "category": "Pulutan",
    "sold": 4
  },
  {
    "category": "Others",
    "sold": 3
  },
  {
    "category": "Unli",
    "sold": 6
  }
]

// Color palette for categories
const colors = [
  "#064e3b", // emerald-900
  "#065f46", // emerald-800
  "#047857", // emerald-700
  "#059669", // emerald-600
  "#10b981", // emerald-500
  "#34d399", // emerald-400
  "#6ee7b7", // emerald-300
  "#a7f3d0", // emerald-200
  "#d1fae5", // emerald-100
  "#ecfdf5", // emerald-50
]

// Transform data and create config dynamically
const chartData = salesData.map((item, index) => ({
  category: item.category,
  sold: item.sold,
  fill: colors[index % colors.length]
}))

const chartConfig = salesData.reduce((config, item, index) => {
  const colorKey = item.category.toLowerCase().replace(/\s+/g, '_')
  return {
    ...config,
    [colorKey]: {
      label: item.category,
      color: colors[index % colors.length]
    }
  }
}, {
  sold: {
    label: "Items Sold",
  },
}) satisfies ChartConfig

export function CategoryPieChart({ data } : { data : {category : string, sold : number}[]}) {

  const chartData = data.map((item, index) => ({
    category: item.category,
    sold: item.sold,
    fill: colors[index % colors.length]
  }))

  const totalSold = chartData.reduce((sum, item) => sum + item.sold, 0)
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="items-center pb-">
        <CardTitle className="text-sm">Sales by Category</CardTitle>
        <CardDescription className="text-xs md:hidden lg:flex">
          Total items sold: {totalSold}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 px-2 py-0 overflow-visible  ">
        <ChartContainer config={chartConfig} className="h-full w-full  overflow-visibl">
          <PieChart width={256} height={200}>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="sold" hideLabel />}
            />
          <Pie
            data={chartData}
            dataKey="sold"
            outerRadius="80%" // restore to your desired full size
            labelLine={false}
            label={({ payload, cx = 0, cy = 0, midAngle = 0, outerRadius = 0 }) => {
              const RADIAN = Math.PI / 180
              const labelRadius = outerRadius + 15 // default is ~outerRadius + 20, so this moves it closer
              const x = cx + labelRadius * Math.cos(-midAngle * RADIAN)
              const y = cy + labelRadius * Math.sin(-midAngle * RADIAN)
            
              return (
                <text
                  x={x}
                  y={y}
                  fill="hsla(var(--foreground))"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={10}
                >
                  {payload.category}
                </text>
              )
            }}
            
            nameKey="category"
          />

          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}