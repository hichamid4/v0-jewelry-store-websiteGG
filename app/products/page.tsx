import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Gem, ArrowLeft } from "lucide-react"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"

interface SearchParams {
  search?: string
  category?: string
  material?: string
  minPrice?: string
  maxPrice?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createClient()

  // Build query based on search params
  let query = supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false })

  if (searchParams.search) {
    query = query.ilike("name", `%${searchParams.search}%`)
  }

  if (searchParams.category) {
    query = query.eq("category", searchParams.category)
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

  const { data: products } = await query

  // Get unique categories and materials for filters
  const { data: allProducts } = await supabase.from("products").select("category, material").eq("is_active", true)

  const categories = [...new Set(allProducts?.map((p) => p.category) || [])]
  const materials = [...new Set(allProducts?.map((p) => p.material) || [])]

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
                  <Gem className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
                  <p className="text-sm text-gray-600">Browse our exquisite jewelry collection</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {products?.length || 0} Products
              </Badge>
              <Link href="/admin">
                <Button variant="outline">Admin Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <ProductFilters categories={categories} materials={materials} searchParams={searchParams} />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <ProductGrid products={products || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
