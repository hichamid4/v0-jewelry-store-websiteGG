"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Minus, Edit } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  material: string
  price: number
  stock_quantity: number
  weight: number
  is_active: boolean
}

interface InventoryTableProps {
  products: Product[]
}

export function InventoryTable({ products }: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add")
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("")
  const [adjustmentReason, setAdjustmentReason] = useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.material.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleStockAdjustment = async () => {
    if (!selectedProduct || !adjustmentQuantity || !adjustmentReason) return

    const quantity = Number.parseInt(adjustmentQuantity)
    const change = adjustmentType === "add" ? quantity : -quantity

    // Here you would typically make an API call to update the stock
    console.log("[v0] Stock adjustment:", {
      productId: selectedProduct.id,
      change,
      reason: adjustmentReason,
    })

    // Reset form
    setSelectedProduct(null)
    setAdjustmentQuantity("")
    setAdjustmentReason("")
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (quantity <= 5) return { label: "Low Stock", color: "bg-red-100 text-red-800" }
    if (quantity <= 10) return { label: "Medium Stock", color: "bg-amber-100 text-amber-800" }
    return { label: "In Stock", color: "bg-green-100 text-green-800" }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Inventory Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Product</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Current Stock</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Value</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const status = getStockStatus(product.stock_quantity)
              return (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {product.material}
                        </Badge>
                        <span className="text-xs text-gray-600">{product.weight}g</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-lg font-bold text-gray-900">{product.stock_quantity}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${status.color}`}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${(product.price * product.stock_quantity).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Adjust Stock - {product.name}</DialogTitle>
                            <DialogDescription>Current stock: {product.stock_quantity} units</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="adjustment-type">Adjustment Type</Label>
                                <Select
                                  value={adjustmentType}
                                  onValueChange={(value: "add" | "remove") => setAdjustmentType(value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="add">Add Stock</SelectItem>
                                    <SelectItem value="remove">Remove Stock</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                  id="quantity"
                                  type="number"
                                  min="1"
                                  value={adjustmentQuantity}
                                  onChange={(e) => setAdjustmentQuantity(e.target.value)}
                                  placeholder="Enter quantity"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="reason">Reason</Label>
                              <Textarea
                                id="reason"
                                value={adjustmentReason}
                                onChange={(e) => setAdjustmentReason(e.target.value)}
                                placeholder="Reason for adjustment (e.g., New shipment, Damaged goods, etc.)"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleStockAdjustment}>
                                {adjustmentType === "add" ? (
                                  <Plus className="h-4 w-4 mr-2" />
                                ) : (
                                  <Minus className="h-4 w-4 mr-2" />
                                )}
                                Apply Adjustment
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">No products found matching your search.</div>
      )}
    </div>
  )
}
