"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Search, Eye, EyeOff } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  material: string
  price: number
  stock_quantity: number
  weight: number
  is_active: boolean
  is_featured: boolean
}

interface AdminProductTableProps {
  products: Product[]
}

export function AdminProductTable({ products }: AdminProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showInactive, setShowInactive] = useState(false)

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.material.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = showInactive || product.is_active

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant={showInactive ? "default" : "outline"} size="sm" onClick={() => setShowInactive(!showInactive)}>
          {showInactive ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {showInactive ? "Hide Inactive" : "Show All"}
        </Button>
      </div>

      {/* Products Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Product</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Price</TableHead>
              <TableHead className="font-semibold">Stock</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {product.material}
                      </Badge>
                      <span className="text-xs text-gray-600">{product.weight}g</span>
                      {product.is_featured && (
                        <Badge className="text-xs bg-gradient-to-r from-amber-500 to-yellow-600">Featured</Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">${product.price.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        product.stock_quantity <= 5
                          ? "text-red-600"
                          : product.stock_quantity <= 10
                            ? "text-amber-600"
                            : "text-green-600"
                      }`}
                    >
                      {product.stock_quantity}
                    </span>
                    {product.stock_quantity <= 5 && (
                      <Badge variant="destructive" className="text-xs">
                        Low
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={product.is_active ? "default" : "secondary"}
                    className={product.is_active ? "bg-green-100 text-green-800" : ""}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">No products found matching your criteria.</div>
      )}
    </div>
  )
}
