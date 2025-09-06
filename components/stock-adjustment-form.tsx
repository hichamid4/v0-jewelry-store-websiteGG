"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus } from "lucide-react"

interface Product {
  id: string
  name: string
  stock_quantity: number
}

interface StockAdjustmentFormProps {
  products: Product[]
}

export function StockAdjustmentForm({ products }: StockAdjustmentFormProps) {
  const [selectedProductId, setSelectedProductId] = useState("")
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add")
  const [quantity, setQuantity] = useState("")
  const [reason, setReason] = useState("")

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProductId || !quantity || !reason) return

    const change = adjustmentType === "add" ? Number.parseInt(quantity) : -Number.parseInt(quantity)

    // Here you would typically make an API call
    console.log("[v0] Quick stock adjustment:", {
      productId: selectedProductId,
      change,
      reason,
    })

    // Reset form
    setSelectedProductId("")
    setQuantity("")
    setReason("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="product">Select Product</Label>
        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} (Current: {product.stock_quantity})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProduct && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Current Stock: <span className="font-medium">{selectedProduct.stock_quantity} units</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={adjustmentType} onValueChange={(value: "add" | "remove") => setAdjustmentType(value)}>
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
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="reason">Reason</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for adjustment"
          rows={3}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
        disabled={!selectedProductId || !quantity || !reason}
      >
        {adjustmentType === "add" ? <Plus className="h-4 w-4 mr-2" /> : <Minus className="h-4 w-4 mr-2" />}
        Apply Adjustment
      </Button>
    </form>
  )
}
