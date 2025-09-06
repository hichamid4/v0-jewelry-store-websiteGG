"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  material: string
  price: number
  stock_quantity: number
}

interface RecordSaleFormProps {
  products: Product[]
}

export function RecordSaleForm({ products }: RecordSaleFormProps) {
  const [formData, setFormData] = useState({
    product_id: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    quantity: "1",
    discount_amount: "0",
    notes: "",
  })

  const selectedProduct = products.find((p) => p.id === formData.product_id)
  const subtotal = selectedProduct ? selectedProduct.price * Number.parseInt(formData.quantity) : 0
  const discount = Number.parseFloat(formData.discount_amount) || 0
  const total = subtotal - discount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.product_id || !formData.customer_name || !formData.quantity) return

    const saleData = {
      ...formData,
      quantity: Number.parseInt(formData.quantity),
      discount_amount: discount,
      total_amount: total,
      sale_date: new Date().toISOString(),
    }

    // Here you would typically make an API call to record the sale
    console.log("[v0] Recording sale:", saleData)

    // Reset form after successful submission
    setFormData({
      product_id: "",
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      quantity: "1",
      discount_amount: "0",
      notes: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="product">Select Product *</Label>
            <Select value={formData.product_id} onValueChange={(value) => handleInputChange("product_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{product.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ${product.price} ({product.stock_quantity} left)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                <span className="text-lg font-bold text-gray-900">${selectedProduct.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {selectedProduct.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {selectedProduct.material}
                </Badge>
                <span className="text-xs text-gray-600">{selectedProduct.stock_quantity} in stock</span>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={selectedProduct?.stock_quantity || 1}
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="discount">Discount Amount ($)</Label>
            <Input
              id="discount"
              type="number"
              step="0.01"
              min="0"
              max={subtotal}
              value={formData.discount_amount}
              onChange={(e) => handleInputChange("discount_amount", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="customer_name">Customer Name *</Label>
            <Input
              id="customer_name"
              value={formData.customer_name}
              onChange={(e) => handleInputChange("customer_name", e.target.value)}
              placeholder="Enter customer name"
              required
            />
          </div>

          <div>
            <Label htmlFor="customer_email">Customer Email</Label>
            <Input
              id="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={(e) => handleInputChange("customer_email", e.target.value)}
              placeholder="customer@example.com"
            />
          </div>

          <div>
            <Label htmlFor="customer_phone">Customer Phone</Label>
            <Input
              id="customer_phone"
              type="tel"
              value={formData.customer_phone}
              onChange={(e) => handleInputChange("customer_phone", e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Sale Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Sale Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          placeholder="Additional notes about this sale..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          disabled={!formData.product_id || !formData.customer_name || !formData.quantity}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Record Sale
        </Button>
      </div>
    </form>
  )
}
