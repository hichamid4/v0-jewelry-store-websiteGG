"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface ProductFiltersProps {
  categories: string[]
  materials: string[]
  searchParams: {
    search?: string
    category?: string
    material?: string
    minPrice?: string
    maxPrice?: string
  }
}

export function ProductFilters({ categories, materials, searchParams }: ProductFiltersProps) {
  const router = useRouter()
  const currentSearchParams = useSearchParams()

  const [filters, setFilters] = useState({
    search: searchParams.search || "",
    category: searchParams.category || "all",
    material: searchParams.material || "all",
    minPrice: searchParams.minPrice || "",
    maxPrice: searchParams.maxPrice || "",
  })

  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams()

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    const queryString = params.toString()
    router.push(`/products${queryString ? `?${queryString}` : ""}`)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      category: "",
      material: "",
      minPrice: "",
      maxPrice: "",
    }
    setFilters(clearedFilters)
    updateURL(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-yellow-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium text-gray-700">
            Search Products
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Category</Label>
          <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Material */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Material</Label>
          <Select value={filters.material} onValueChange={(value) => handleFilterChange("material", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All materials" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All materials</SelectItem>
              {materials.map((material) => (
                <SelectItem key={material} value={material}>
                  {material}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                placeholder="Min price"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="Max price"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
