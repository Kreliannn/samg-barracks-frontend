"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
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

const chartData = [
  { menu: "meal 3", sold: 11, img: "https://res.cloudinary.com/dljxtf9dg/image/upload/v1751430887/nextjs_uploads/tsovfj0vo4jz4jforkz5.jpg" },
  { menu: "rice", sold: 21, img: "https://res.cloudinary.com/dljxtf9dg/image/upload/v1751431067/nextjs_uploads/u14lzd2qcgesigwomgo3.jpg" },
  { menu: "meal 2", sold: 32, img: "https://res.cloudinary.com/dljxtf9dg/image/upload/v1751430841/nextjs_uploads/goxd7oefd4konq82fcpc.jpg" },
  { menu: "chicken wings", sold: 22, img: "https://res.cloudinary.com/dljxtf9dg/image/upload/v1751430750/nextjs_uploads/cp6e3wg0gwtvrviclz1v.jpg" },
  { menu: "fried chicken", sold: 13, img: "https://res.cloudinary.com/dljxtf9dg/image/upload/v1751430719/nextjs_uploads/gkczusvmmqmjyaphcthf.jpg" },
  { menu: "pepsi", sold: 44, img: "https://res.cloudinary.com/dljxtf9dg/image/upload/v1751430956/nextjs_uploads/vpcerp0jdvbfknovlpy2.jpg" },
  { menu: "meal 1", sold: 24, img: "https://res.cloudinary.com/dljxtf9dg/image/upload/v1751430794/nextjs_uploads/msypdve4fmf4vc8g8foe.jpg" },
  { menu: "coke", sold: 10, img: "https://res.cloudinary.com/dljxtf9dg/image/upload/v1751430926/nextjs_uploads/jeoy2zv8gfzhlmtehghl.jpg" },
];

// Sort the data
const sortedData = [...chartData].sort((a, b) => a.sold - b.sold);

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: any[]
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <img
          src={data.img}
          alt={data.menu}
          className="w-16 h-16 object-cover rounded-md mb-2"
        />
        <p className="font-semibold text-sm capitalize">{data.menu}</p>
        <p className="text-stone-600 font-medium">Sold: {data.sold}</p>
      </div>
    )
  }
  return null
}

export default function MenuBarChart({ data } : { data : {menu : string, sold : number, img : string}[]}) {
  const dynamicBarSize = Math.max(20, Math.min(60, 400 / sortedData.length))

  return (
    <Card className="h-full w-full flex flex-col p-3">
      <CardHeader className="px-4 pb-1">
        <CardTitle className="text-sm">Top Sales Menu</CardTitle>
        <CardDescription className="text-xs">
          from lowest to highest
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 pb-2 pt-1 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, bottom: 0, left: 0, right: 0 }}
            barCategoryGap={10}
            barSize={dynamicBarSize}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="menu"
              tickLine={false}
              tickMargin={6}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 8)}
            />
            <YAxis
              type="number"
              domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.05)]}
              hide
            />
            <Tooltip
              content={CustomTooltip}
              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
            />
            <Bar
              dataKey="sold"
              fill="#064e3b"
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

