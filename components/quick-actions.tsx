import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, BarChart3, Package, ShoppingCart, FileText, Settings } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Add Product",
      description: "Add new jewelry item",
      icon: Plus,
      href: "/admin/add-product",
      color: "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700",
    },
    {
      title: "Record Sale",
      description: "Log a new sale",
      icon: ShoppingCart,
      href: "/admin/record-sale",
      color: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
    },
    {
      title: "View Analytics",
      description: "Sales & inventory reports",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
    },
    {
      title: "Manage Inventory",
      description: "Update stock levels",
      icon: Package,
      href: "/admin/inventory",
      color: "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700",
    },
    {
      title: "Export Data",
      description: "Download reports",
      icon: FileText,
      href: "/admin/export",
      color: "bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700",
    },
    {
      title: "Settings",
      description: "Store configuration",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Button variant="outline" className="w-full justify-start h-auto p-4 hover:bg-gray-50 bg-transparent">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm text-gray-900">{action.title}</p>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
