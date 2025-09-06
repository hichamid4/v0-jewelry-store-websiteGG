import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Gem, Search, ShoppingBag, Star } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()

  // Get featured products (best sellers or featured items)
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8)

  // Get categories with product counts
  const { data: categoryStats } = await supabase.from("products").select("category").eq("is_active", true)

  const categories = ["rings", "earrings", "bracelets", "chains", "gormmitte", "dablij", "podontife"]
  const categoryCount = categories.reduce(
    (acc, cat) => {
      acc[cat] = categoryStats?.filter((p) => p.category === cat).length || 0
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                <Gem className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Golden Jewelry</h1>
                <p className="text-sm text-gray-600">Premium Jewelry Collection</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/shop">
                <Button variant="ghost" className="text-gray-900 hover:text-gray-700 hover:bg-gray-100">
                  <Search className="h-4 w-4 mr-2" />
                  Shop
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Discover Exquisite Jewelry</h2>
          <p className="text-xl mb-8 text-blue-100">Premium gold, silver, and diamond pieces crafted to perfection</p>
          <Link href="/shop">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Shop by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <Link key={category} href={`/shop?category=${category}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200 hover:border-blue-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <Gem className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 capitalize mb-2">{category}</h4>
                    <p className="text-sm text-gray-600">{categoryCount[category]} items</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h3>
              <p className="text-gray-600">Discover our most popular and newest jewelry pieces</p>
            </div>
            <Link href="/shop">
              <Button variant="outline" className="text-gray-700 border-gray-300 bg-transparent">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow border-gray-200">
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={product.image_url || `/placeholder.svg?height=300&width=300&text=${product.name}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h4>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {product.material}
                    </Badge>
                    {product.model && (
                      <Badge variant="outline" className="text-xs">
                        {product.model}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900">${product.price}</p>
                      {product.weight_grams && <p className="text-sm text-gray-600">{product.weight_grams}g</p>}
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Golden Jewelry</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Premium Quality</h4>
              <p className="text-gray-600">
                Handcrafted jewelry made with the finest materials and attention to detail
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Easy Shopping</h4>
              <p className="text-gray-600">Browse our collection online and enjoy convenient payment options</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Gem className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Authentic Pieces</h4>
              <p className="text-gray-600">Every piece is certified authentic with detailed specifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                  <Gem className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold">Golden Jewelry</h4>
              </div>
              <p className="text-gray-400">Your trusted partner for premium jewelry and exceptional service.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/shop" className="hover:text-white">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=rings" className="hover:text-white">
                    Rings
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=earrings" className="hover:text-white">
                    Earrings
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=chains" className="hover:text-white">
                    Chains
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contact Info</h5>
              <div className="space-y-2 text-gray-400">
                <p>Email: info@goldenjewelry.com</p>
                <p>Phone: +20 123 456 789</p>
                <p>Address: Cairo, Egypt</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Golden Jewelry. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
