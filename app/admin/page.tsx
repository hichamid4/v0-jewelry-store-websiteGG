import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, DollarSign, Plus, ArrowLeft, AlertTriangle, BarChart3, ShoppingCart } from "lucide-react"
import { AdminProductTable } from "@/components/admin-product-table"
import { QuickActions } from "@/components/quick-actions"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get comprehensive dashboard data
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  const { data: recentSales } = await supabase
    .from("sales")
    .select(`
      *,
      products (name, category, material)
    `)
    .order("sale_date", { ascending: false })
    .limit(10)

  const { data: lowStockProducts } = await supabase
    .from("products")
    .select("*")
    .lte("stock_quantity", 5)
    .eq("is_active", true)

  // Calculate metrics
  const totalProducts = products?.length || 0
  const activeProducts = products?.filter((p) => p.is_active).length || 0
  const totalValue = products?.reduce((sum, p) => sum + p.price * p.stock_quantity, 0) || 0
  const todaysSales =
    recentSales
      ?.filter((s) => {
        const today = new Date().toDateString()
        return new Date(s.sale_date).toDateString() === today
      })
      .reduce((sum, s) => sum + s.total_amount, 0) || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">Manage your jewelry store</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/products">
                <Button variant="outline">View Catalog</Button>
              </Link>
              <Link href="/admin/add-product">
                <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
              <p className="text-xs text-gray-600">{activeProducts} active</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Total stock value</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Today's Sales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${todaysSales.toLocaleString()}</div>
              <p className="text-xs text-gray-600">
                From{" "}
                {recentSales?.filter((s) => {
                  const today = new Date().toDateString()
                  return new Date(s.sale_date).toDateString() === today
                }).length || 0}{" "}
                transactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Low Stock Alert</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{lowStockProducts?.length || 0}</div>
              <p className="text-xs text-gray-600">Items need restocking</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Low Stock Alerts */}
            {lowStockProducts && lowStockProducts.length > 0 && (
              <Card className="border-red-200 bg-gradient-to-br from-red-50/50 to-pink-50/50">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Low Stock Alerts
                  </CardTitle>
                  <CardDescription>Products that need immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockProducts.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {product.category}
                            </Badge>
                            <Badge variant="destructive" className="text-xs">
                              {product.stock_quantity} left
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Restock
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Products Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-900">Product Management</CardTitle>
                    <CardDescription>Manage your jewelry inventory</CardDescription>
                  </div>
                  <Link href="/admin/add-product">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <AdminProductTable products={products || []} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Recent Sales */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Recent Sales</CardTitle>
                <CardDescription>Latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSales?.slice(0, 5).map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{sale.products?.name}</p>
                        <p className="text-xs text-gray-600">{sale.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-gray-900">${sale.total_amount}</p>
                        <p className="text-xs text-gray-600">{new Date(sale.sale_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/admin/sales">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View All Sales
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
