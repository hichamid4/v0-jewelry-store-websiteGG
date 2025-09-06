import { createClient } from "@/lib/supabase/server"
import { ProductFilters } from "@/components/product-filters"
import { ProductGrid } from "@/components/product-grid"
import { Gem } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface SearchParams {
  category?: string
  model?: string
  material?: string
  minPrice?: string
  maxPrice?: string
  minWeight?: string
  maxWeight?: string
  search?: string
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createClient()

  // Build query based on search parameters
  let query = supabase.from("products").select("*").eq("is_active", true)

  if (searchParams.category) {
    query = query.eq("category", searchParams.category)
  }

  if (searchParams.model) {
    query = query.eq("model", searchParams.model)
  }

  if (searchParams.material) {
    query = query.eq("material", searchParams.material)
  }

  if (searchParams.minPrice) {
    query = query.gte("price", Number.parseFloat(searchParams.minPrice))
  }

  if (searchParams.maxPrice) {
    query = query.lte("price", Number.parseFloat(searchParams.maxPrice))
  }

  if (searchParams.minWeight) {
    query = query.gte("weight_grams", Number.parseFloat(searchParams.minWeight))
  }

  if (searchParams.maxWeight) {
    query = query.lte("weight_grams", Number.parseFloat(searchParams.maxWeight))
  }

  if (searchParams.search) {
    query = query.ilike("name", `%${searchParams.search}%`)
  }

  const { data: products } = await query.order("created_at", { ascending: false })

  // Get unique values for filters
  const { data: allProducts } = await supabase
    .from("products")
    .select("category, model, material")
    .eq("is_active", true)

  const categories = [...new Set(allProducts?.map((p) => p.category) || [])]
  const models = [...new Set(allProducts?.map((p) => p.model).filter(Boolean) || [])]
  const materials = [...new Set(allProducts?.map((p) => p.material) || [])]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                <Gem className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Golden Jewelry</h1>
                <p className="text-sm text-gray-600">Shop Collection</p>
              </div>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                  Home
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Jewelry Collection</h2>
          <p className="text-gray-600">{products?.length || 0} products found</p>
        </div>

        {/* Horizontal Filters */}
        <ProductFilters categories={categories} models={models} materials={materials} searchParams={searchParams} />

        {/* Products Grid */}
        <ProductGrid products={products || []} />
      </div>
    </div>
  )
}
