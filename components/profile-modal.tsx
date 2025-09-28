"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToolItem } from "./tool-item"
import { useAuth } from "@/hooks/use-auth"
import { Search, Bookmark, TrendingUp, Calendar, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Tool {
  name: string
  logoUrl: string
  website: string
  prompt: string
  pricing?: string
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  bookmarkedTools: Tool[]
  onBookmark: (tool: Tool) => void
}

export function ProfileModal({ isOpen, onClose, bookmarkedTools, onBookmark }: ProfileModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Group bookmarked tools by pricing
  const toolsByPricing = useMemo(() => {
    const grouped = bookmarkedTools.reduce(
      (acc, tool) => {
        const pricing = tool.pricing || "Free"
        if (!acc[pricing]) acc[pricing] = []
        acc[pricing].push(tool)
        return acc
      },
      {} as Record<string, Tool[]>,
    )
    return grouped
  }, [bookmarkedTools])

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    let filtered = bookmarkedTools

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (tool) => tool.name.toLowerCase().includes(query) || tool.prompt.toLowerCase().includes(query),
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((tool) => (tool.pricing || "Free") === selectedCategory)
    }

    return filtered
  }, [bookmarkedTools, searchQuery, selectedCategory])

  const categories = ["All", ...Object.keys(toolsByPricing).sort()]

  const handleExportTools = () => {
    const exportData = {
      user: user?.name,
      exportDate: new Date().toISOString(),
      tools: bookmarkedTools,
      totalTools: bookmarkedTools.length,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-toolnest-bookmarks-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export successful",
      description: "Your bookmarked tools have been exported to a JSON file",
    })
  }

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all bookmarked tools? This action cannot be undone.")) {
      bookmarkedTools.forEach((tool) => onBookmark(tool)) // Remove all bookmarks
      toast({
        title: "Bookmarks cleared",
        description: "All bookmarked tools have been removed from your ToolNest",
      })
    }
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">My ToolNest</DialogTitle>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user.name}! Manage your saved AI tools collection.
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tools">My Tools ({bookmarkedTools.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 overflow-y-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-accent/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Bookmark className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Total Tools</h3>
                </div>
                <p className="text-2xl font-bold text-primary">{bookmarkedTools.length}</p>
                <p className="text-sm text-muted-foreground">Saved to your collection</p>
              </div>

              <div className="bg-accent/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">Categories</h3>
                </div>
                <p className="text-2xl font-bold text-green-500">{Object.keys(toolsByPricing).length}</p>
                <p className="text-sm text-muted-foreground">Different pricing tiers</p>
              </div>

              <div className="bg-accent/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">Member Since</h3>
                </div>
                <p className="text-2xl font-bold text-blue-500">Today</p>
                <p className="text-sm text-muted-foreground">Welcome to ToolNest!</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleExportTools} disabled={bookmarkedTools.length === 0}>
                  Export Tools
                </Button>
                <Button variant="outline" onClick={handleClearAll} disabled={bookmarkedTools.length === 0}>
                  Clear All
                </Button>
              </div>
            </div>

            {/* Recent Tools Preview */}
            {bookmarkedTools.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recently Saved</h3>
                <div className="space-y-2">
                  {bookmarkedTools.slice(0, 3).map((tool, index) => (
                    <ToolItem key={`${tool.name}-${index}`} tool={tool} onBookmark={onBookmark} isBookmarked={true} />
                  ))}
                </div>
                {bookmarkedTools.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    And {bookmarkedTools.length - 3} more tools in your collection...
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tools" className="flex-1 flex flex-col overflow-hidden">
            {/* Search and Filter */}
            <div className="flex-shrink-0 space-y-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search your saved tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category} {category !== "All" && `(${toolsByPricing[category]?.length || 0})`}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tools List */}
            <div className="flex-1 overflow-y-auto">
              {filteredTools.length > 0 ? (
                <div className="space-y-2">
                  {filteredTools.map((tool, index) => (
                    <div
                      key={`${tool.name}-${index}`}
                      className="animate-in slide-in-from-left-2 fade-in-0 duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ToolItem tool={tool} onBookmark={onBookmark} isBookmarked={true} />
                    </div>
                  ))}
                </div>
              ) : bookmarkedTools.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No tools saved yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring AI tools and bookmark your favorites to build your personal ToolNest collection.
                  </p>
                  <Button onClick={onClose}>Explore Tools</Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No matching tools</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter to find the tools you're looking for.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 overflow-y-auto space-y-6">
            {/* Pricing Distribution */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tools by Pricing Model</h3>
              {Object.keys(toolsByPricing).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(toolsByPricing).map(([pricing, tools]) => {
                    const percentage = (tools.length / bookmarkedTools.length) * 100
                    return (
                      <div key={pricing} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{pricing}</span>
                          <span className="text-sm text-muted-foreground">
                            {tools.length} tools ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              pricing === "Free"
                                ? "bg-green-500"
                                : pricing === "Freemium"
                                  ? "bg-blue-500"
                                  : "bg-orange-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No data available. Start bookmarking tools to see analytics.</p>
              )}
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recommendations</h3>
              <div className="space-y-3">
                {bookmarkedTools.length === 0 && (
                  <div className="bg-accent/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Get Started</h4>
                    <p className="text-sm text-muted-foreground">
                      Bookmark your first AI tool to start building your personalized collection and unlock analytics
                      insights.
                    </p>
                  </div>
                )}

                {bookmarkedTools.length > 0 && bookmarkedTools.length < 5 && (
                  <div className="bg-accent/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Expand Your Collection</h4>
                    <p className="text-sm text-muted-foreground">
                      You have {bookmarkedTools.length} tools saved. Try exploring different industries to discover more
                      AI tools that match your workflow.
                    </p>
                  </div>
                )}

                {bookmarkedTools.length >= 5 && (
                  <div className="bg-accent/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Power User</h4>
                    <p className="text-sm text-muted-foreground">
                      Great collection! You've saved {bookmarkedTools.length} tools. Consider organizing them by
                      creating custom categories or exporting your collection.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
