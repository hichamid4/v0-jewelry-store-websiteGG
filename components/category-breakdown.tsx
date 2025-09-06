"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface CategoryBreakdownProps {
  data: Record<string, { revenue: number; sales: number }>
  type: "category" | "material"
}

export function CategoryBreakdown({ data, type }: CategoryBreakdownProps) {
  const entries = Object.entries(data).sort(([, a], [, b]) => b.revenue - a.revenue)
  const maxRevenue = Math.max(...entries.map(([, item]) => item.revenue))

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No {type} data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {entries.map(([name, stats]) => {
        const percentage = maxRevenue > 0 ? (stats.revenue / maxRevenue) * 100 : 0

        return (
          <div key={name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {name}
                </Badge>
                <span className="text-xs text-gray-600">{stats.sales} sales</span>
              </div>
              <span className="text-sm font-medium text-gray-900">${stats.revenue.toLocaleString()}</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        )
      })}
    </div>
  )
}
