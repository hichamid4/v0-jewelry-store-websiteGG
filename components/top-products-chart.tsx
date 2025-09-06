"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TopProductsChartProps {
  data: Array<{
    product: {
      name: string
      category: string
    }
    totalRevenue: number
    totalSales: number
  }>
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  const chartData = data.map((item, index) => ({
    name:
      item.product?.name?.substring(0, 15) + (item.product?.name?.length > 15 ? "..." : "") || `Product ${index + 1}`,
    revenue: item.totalRevenue,
    sales: item.totalSales,
  }))

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            className="text-xs text-gray-600"
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            className="text-xs text-gray-600"
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number, name: string) => [
              name === "revenue" ? `$${value.toLocaleString()}` : value,
              name === "revenue" ? "Revenue" : "Sales Count",
            ]}
          />
          <Bar dataKey="revenue" fill="url(#colorBar)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
