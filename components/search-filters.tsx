"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

interface SearchFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedIndustry: string
  onIndustryChange: (industry: string) => void
  selectedPricing: string
  onPricingChange: (pricing: string) => void
  industries: string[]
}

const pricingOptions = ["All", "Free", "Freemium", "Paid"]

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedIndustry,
  onIndustryChange,
  selectedPricing,
  onPricingChange,
  industries,
}: SearchFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const hasActiveFilters = selectedIndustry !== "All" || selectedPricing !== "All"

  const clearFilters = () => {
    onIndustryChange("All")
    onPricingChange("All")
    onSearchChange("")
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search AI tools by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-muted/50 border-border"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <div className="flex items-center gap-2">
        <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {(selectedIndustry !== "All" ? 1 : 0) + (selectedPricing !== "All" ? 1 : 0)}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Industry</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["All", ...industries].map((industry) => (
              <DropdownMenuItem
                key={industry}
                onClick={() => onIndustryChange(industry)}
                className={selectedIndustry === industry ? "bg-accent" : ""}
              >
                {industry}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Pricing Model</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {pricingOptions.map((pricing) => (
              <DropdownMenuItem
                key={pricing}
                onClick={() => onPricingChange(pricing)}
                className={selectedPricing === pricing ? "bg-accent" : ""}
              >
                {pricing}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
