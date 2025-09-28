"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { SkillLevelToggle } from "@/components/skill-level-toggle"
import { IndustryPlacard } from "@/components/industry-placard"
import { SearchFilters } from "@/components/search-filters"
import { ProfileModal } from "@/components/profile-modal"
import { useAuth } from "@/hooks/use-auth"
import toolsData from "@/data/tools.json"
import { Search } from "lucide-react"

type SkillLevel = "Beginner" | "Intermediate" | "Advanced"

interface Tool {
  name: string
  logoUrl: string
  website: string
  prompt: string
  pricing?: string
}

interface ToolCategory {
  industry: string
  level: string
  pricing?: string
  tools: Tool[]
}

export default function HomePage() {
  const { user, isLoading: authLoading } = useAuth()
  const [currentLevel, setCurrentLevel] = useState<SkillLevel>("Beginner")
  const [bookmarkedTools, setBookmarkedTools] = useState<Tool[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("All")
  const [selectedPricing, setSelectedPricing] = useState("All")
  const [focusedPlacardIndex, setFocusedPlacardIndex] = useState<number | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Load bookmarked tools from localStorage on mount
  useEffect(() => {
    if (authLoading) return

    const storageKey = user ? `bookmarkedTools_${user.email}` : "bookmarkedTools"
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setBookmarkedTools(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to load bookmarked tools:", error)
      }
    }
  }, [user, authLoading])

  // Save bookmarked tools to localStorage whenever it changes
  useEffect(() => {
    if (authLoading) return

    const storageKey = user ? `bookmarkedTools_${user.email}` : "bookmarkedTools"
    localStorage.setItem(storageKey, JSON.stringify(bookmarkedTools))
  }, [bookmarkedTools, user, authLoading])

  const handlePlacardFocus = (index: number) => {
    setFocusedPlacardIndex(index)
    document.body.style.overflow = "hidden" // Prevent background scrolling
  }

  const handlePlacardBlur = () => {
    setFocusedPlacardIndex(null)
    document.body.style.overflow = "unset" // Restore scrolling
  }

  // Close focused placard on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focusedPlacardIndex !== null) {
        handlePlacardBlur()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [focusedPlacardIndex])

  const handleBookmark = (tool: Tool) => {
    setBookmarkedTools((prev) => {
      const isAlreadyBookmarked = prev.some(
        (bookmarked) => bookmarked.name === tool.name && bookmarked.website === tool.website,
      )

      if (isAlreadyBookmarked) {
        return prev.filter((bookmarked) => !(bookmarked.name === tool.name && bookmarked.website === tool.website))
      } else {
        return [...prev, tool]
      }
    })
  }

  const handleSearchFocus = () => {
    searchRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleProfileClick = () => {
    setShowProfile(true)
  }

  const industries = useMemo(() => {
    const uniqueIndustries = [...new Set((toolsData as ToolCategory[]).map((category) => category.industry))]
    return uniqueIndustries.sort()
  }, [])

  const filteredCategories = useMemo(() => {
    let filtered = (toolsData as ToolCategory[]).filter((category) => category.level === currentLevel)

    if (selectedIndustry !== "All") {
      filtered = filtered.filter((category) => category.industry === selectedIndustry)
    }

    if (searchQuery || selectedPricing !== "All") {
      filtered = filtered
        .map((category) => {
          let filteredTools = category.tools

          if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filteredTools = filteredTools.filter(
              (tool) =>
                tool.name.toLowerCase().includes(query) ||
                tool.prompt.toLowerCase().includes(query) ||
                category.industry.toLowerCase().includes(query),
            )
          }

          if (selectedPricing !== "All") {
            filteredTools = filteredTools.filter((tool) => {
              const toolPricing = tool.pricing || "Free"
              return toolPricing === selectedPricing
            })
          }

          return {
            ...category,
            tools: filteredTools,
          }
        })
        .filter((category) => category.tools.length > 0)
    }

    return filtered
  }, [currentLevel, selectedIndustry, selectedPricing, searchQuery])

  const totalResults = filteredCategories.reduce((sum, category) => sum + category.tools.length, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSearchFocus={handleSearchFocus} onProfileClick={handleProfileClick} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-in slide-in-from-top-4 fade-in-0 duration-700">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Your Personalized AI Overview
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover the best AI tools curated for your industry and skill level. From content creation to data
            analysis, find the perfect AI companion for your workflow.
          </p>
        </div>

        {/* Skill Level Toggle */}
        <div className="animate-in slide-in-from-top-4 fade-in-0 duration-700" style={{ animationDelay: "200ms" }}>
          <SkillLevelToggle onLevelChange={setCurrentLevel} />
        </div>

        {/* Search and Filters */}
        <div
          ref={searchRef}
          className="animate-in slide-in-from-top-4 fade-in-0 duration-700"
          style={{ animationDelay: "400ms" }}
        >
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedIndustry={selectedIndustry}
            onIndustryChange={setSelectedIndustry}
            selectedPricing={selectedPricing}
            onPricingChange={setSelectedPricing}
            industries={industries}
          />
        </div>

        {/* Results Summary */}
        {(searchQuery || selectedIndustry !== "All" || selectedPricing !== "All") && (
          <div className="mb-6 animate-in slide-in-from-left-2 fade-in-0 duration-500">
            <p className="text-muted-foreground">
              Found {totalResults} tools across {filteredCategories.length} industries
              {searchQuery && (
                <span>
                  {" "}
                  for "<span className="text-foreground font-medium">{searchQuery}</span>"
                </span>
              )}
            </p>
          </div>
        )}

        {/* Industry Placards Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto">
            {filteredCategories.map((category, index) => (
              <div
                key={`${category.industry}-${category.level}-${index}`}
                className="animate-in slide-in-from-bottom-4 fade-in-0 duration-500"
                style={{ animationDelay: `${600 + index * 50}ms` }}
              >
                <IndustryPlacard
                  industry={category.industry}
                  level={category.level}
                  tools={category.tools}
                  onBookmark={handleBookmark}
                  bookmarkedTools={bookmarkedTools}
                  isFocused={focusedPlacardIndex === index}
                  isBlurred={focusedPlacardIndex !== null && focusedPlacardIndex !== index}
                  onFocus={() => handlePlacardFocus(index)}
                  onBlur={handlePlacardBlur}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-in zoom-in-95 fade-in-0 duration-500">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No tools found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </main>

      {/* ProfileModal component */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        bookmarkedTools={bookmarkedTools}
        onBookmark={handleBookmark}
      />
    </div>
  )
}
