import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gem, Star, Package } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  material: string
  weight: number
  stock_quantity: number
  image_url?: string
  is_featured: boolean
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group hover:shadow-lg transition-all duration-300 border-amber-100 hover:border-amber-200"
        >
          <CardHeader className="pb-3">
            <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg mb-3 overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="p-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full">
                    <Gem className="h-8 w-8 text-white" />
                  </div>
                </div>
              )}
              {product.is_featured && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
              {product.stock_quantity <= 5 && (
                <div className="absolute top-2 left-2">
                  <Badge variant="destructive" className="text-xs">
                    Low Stock
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg text-gray-900 group-hover:text-amber-700 transition-colors">
                  {product.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {product.material}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${product.price.toLocaleString()}</p>
                <p className="text-xs text-gray-600">{product.weight}g</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</CardDescription>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="h-4 w-4" />
                <span>{product.stock_quantity} in stock</span>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
                disabled={product.stock_quantity === 0}
              >
                {product.stock_quantity === 0 ? "Out of Stock" : "View Details"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
