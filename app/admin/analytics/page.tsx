import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, ArrowLeft, TrendingUp, DollarSign, ShoppingCart, Star } from "lucide-react"
import { SalesChart } from "@/components/sales-chart"
import { TopProductsChart } from "@/components/top-products-chart"
import { CategoryBreakdown } from "@/components/category-breakdown"

export default async function SalesAnalytics() {
  const supabase = await createClient()

  // Get comprehensive sales data
  const { data: allSales } = await supabase
    .from("sales")
    .select(`
      *,
      products (name, category, material, price)
    `)
    .order("sale_date", { ascending: false })

  const { data: products } = await supabase.from("products").select("*")

  // Calculate analytics metrics
  const totalRevenue = allSales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0
  const totalSales = allSales?.length || 0
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0

  // Get current month data
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const currentMonthSales =
    allSales?.filter((sale) => {
      const saleDate = new Date(sale.sale_date)
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear
    }) || []

  const monthlyRevenue = currentMonthSales.reduce((sum, sale) => sum + sale.total_amount, 0)
  const monthlySalesCount = currentMonthSales.length

  // Calculate best-selling products
  const productSales =
    allSales?.reduce(
      (acc, sale) => {
        const productId = sale.product_id
        if (!acc[productId]) {
          acc[productId] = {
            product: sale.products,
            totalSales: 0,
            totalRevenue: 0,
            quantity: 0,
          }
        }
        acc[productId].totalSales += 1
        acc[productId].totalRevenue += sale.total_amount
        acc[productId].quantity += sale.quantity
        return acc
      },
      {} as Record<string, any>,
    ) || {}

  const topProducts = Object.values(productSales)
    .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)

  // Category performance
  const categoryPerformance =
    allSales?.reduce(
      (acc, sale) => {
        const category = sale.products?.category
        if (!category) return acc

        if (!acc[category]) {
          acc[category] = { revenue: 0, sales: 0 }
        }
        acc[category].revenue += sale.total_amount
        acc[category].sales += 1
        return acc
      },
      {} as Record<string, { revenue: number; sales: number }>,
    ) || {}

  // Material performance
  const materialPerformance =
    allSales?.reduce(
      (acc, sale) => {
        const material = sale.products?.material
        if (!material) return acc

        if (!acc[material]) {
          acc[material] = { revenue: 0, sales: 0 }
        }
        acc[material].revenue += sale.total_amount
        acc[material].sales += 1
        return acc
      },
      {} as Record<string, { revenue: number; sales: number }>,
    ) || {}

  // Monthly sales data for chart (last 6 months)
  const monthlySalesData = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const month = date.getMonth()
    const year = date.getFullYear()

    const monthSales =
      allSales?.filter((sale) => {
        const saleDate = new Date(sale.sale_date)
        return saleDate.getMonth() === month && saleDate.getFullYear() === year
      }) || []

    monthlySalesData.push({
      month: date.toLocaleDateString("en-US", { month: "short" }),
      revenue: monthSales.reduce((sum, sale) => sum + sale.total_amount, 0),
      sales: monthSales.length,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Sales Analytics</h1>
                  <p className="text-sm text-gray-600">Track performance and insights</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {totalSales} Total Sales
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-600">All time sales</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-600">{monthlySalesCount} transactions</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Average Order</CardTitle>
              <ShoppingCart className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${averageOrderValue.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Per transaction</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Orders</CardTitle>
              <Star className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalSales}</div>
              <p className="text-xs text-gray-600">Completed sales</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Revenue Trend</CardTitle>
              <CardDescription>Monthly sales performance (Last 6 months)</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesChart data={monthlySalesData} />
            </CardContent>
          </Card>

          {/* Top Products Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Top Products</CardTitle>
              <CardDescription>Best performing items by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <TopProductsChart data={topProducts} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Category Performance</CardTitle>
              <CardDescription>Sales by jewelry category</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryBreakdown data={categoryPerformance} type="category" />
            </CardContent>
          </Card>

          {/* Material Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Material Performance</CardTitle>
              <CardDescription>Sales by material type</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryBreakdown data={materialPerformance} type="material" />
            </CardContent>
          </Card>

          {/* Best Sellers List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Best Sellers</CardTitle>
              <CardDescription>Top performing products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{item.product?.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {item.product?.category}
                          </Badge>
                          <span className="text-xs text-gray-600">{item.quantity} sold</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-gray-900">${item.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">{item.totalSales} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
