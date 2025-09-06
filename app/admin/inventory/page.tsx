import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, Plus, ArrowLeft, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { InventoryTable } from "@/components/inventory-table"
import { StockAdjustmentForm } from "@/components/stock-adjustment-form"

export default async function InventoryManagement() {
  const supabase = await createClient()

  // Get inventory data with recent logs
  const { data: products } = await supabase.from("products").select("*").order("stock_quantity", { ascending: true })

  const { data: recentLogs } = await supabase
    .from("inventory_logs")
    .select(`
      *,
      products (name, category)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: lowStockProducts } = await supabase
    .from("products")
    .select("*")
    .lte("stock_quantity", 5)
    .eq("is_active", true)

  // Calculate inventory metrics
  const totalItems = products?.reduce((sum, p) => sum + p.stock_quantity, 0) || 0
  const totalValue = products?.reduce((sum, p) => sum + p.price * p.stock_quantity, 0) || 0
  const lowStockCount = lowStockProducts?.length || 0
  const recentAdjustments = recentLogs?.length || 0

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
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                  <p className="text-sm text-gray-600">Manage stock levels and track inventory</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Items</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalItems.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Units in stock</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Inventory worth</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{lowStockCount}</div>
              <p className="text-xs text-gray-600">Items need restocking</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Recent Changes</CardTitle>
              <TrendingDown className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{recentAdjustments}</div>
              <p className="text-xs text-gray-600">Last 10 adjustments</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Inventory Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Inventory Overview</CardTitle>
                <CardDescription>Manage stock levels for all products</CardDescription>
              </CardHeader>
              <CardContent>
                <InventoryTable products={products || []} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stock Adjustment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Quick Adjustment</CardTitle>
                <CardDescription>Adjust stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                <StockAdjustmentForm products={products || []} />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Recent Activity</CardTitle>
                <CardDescription>Latest inventory changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLogs?.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{log.products?.name}</p>
                        <p className="text-xs text-gray-600">{log.change_reason}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold text-sm ${log.quantity_change > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {log.quantity_change > 0 ? "+" : ""}
                          {log.quantity_change}
                        </p>
                        <p className="text-xs text-gray-600">{new Date(log.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alerts */}
            {lowStockProducts && lowStockProducts.length > 0 && (
              <Card className="border-red-200 bg-gradient-to-br from-red-50/50 to-pink-50/50">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Restock Needed
                  </CardTitle>
                  <CardDescription>Items running low</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockProducts.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100"
                      >
                        <div>
                          <p className="font-medium text-sm text-gray-900">{product.name}</p>
                          <Badge variant="destructive" className="text-xs mt-1">
                            {product.stock_quantity} left
                          </Badge>
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
          </div>
        </div>
      </main>
    </div>
  )
}
