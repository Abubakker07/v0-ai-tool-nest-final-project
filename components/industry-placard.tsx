"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToolItem } from "./tool-item"

interface Tool {
  name: string
  logoUrl: string
  website: string
  prompt: string
  pricing?: string
}

interface IndustryPlacardProps {
  industry: string
  level: string
  tools: Tool[]
  onBookmark: (tool: Tool) => void
  bookmarkedTools: Tool[]
  isFocused: boolean
  isBlurred: boolean
  onFocus: () => void
  onBlur: () => void
}

export function IndustryPlacard({
  industry,
  level,
  tools,
  onBookmark,
  bookmarkedTools,
  isFocused,
  isBlurred,
  onFocus,
  onBlur,
}: IndustryPlacardProps) {
  const [showAllTools, setShowAllTools] = useState(false)

  const displayedTools = showAllTools ? tools : tools.slice(0, 3)
  const hasMoreTools = tools.length > 3

  const isToolBookmarked = (tool: Tool) => {
    return bookmarkedTools.some((bookmarked) => bookmarked.name === tool.name && bookmarked.website === tool.website)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger focus if clicking on interactive elements
    if ((e.target as HTMLElement).closest("button, a")) {
      return
    }

    if (isFocused) {
      onBlur()
    } else {
      onFocus()
    }
  }

  return (
    <>
      {/* Backdrop overlay when focused */}
      {isFocused && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-in fade-in-0 duration-300"
          onClick={onBlur}
        />
      )}

      <div
        className={`
          bg-card border border-border rounded-xl p-6 transition-all duration-300 cursor-pointer
          ${
            isFocused
              ? "fixed inset-4 md:inset-8 lg:inset-16 z-50 shadow-2xl shadow-primary/20 scale-100 animate-in zoom-in-95 fade-in-0 duration-300 overflow-y-auto"
              : isBlurred
                ? "blur-sm opacity-50 scale-95 hover:blur-none hover:opacity-100 hover:scale-100"
                : "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] hover:-translate-y-1"
          }
        `}
        onClick={handleCardClick}
      >
        {/* Close button when focused */}
        {isFocused && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onBlur()
            }}
            className="absolute top-4 right-4 z-10 hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:bg-primary/30">
            <span className="text-primary font-semibold text-sm">AI</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground text-balance">{industry}</h3>
            <p className="text-sm text-muted-foreground">{level} Level</p>
          </div>
        </div>

        {/* Tools List */}
        <div className="space-y-1">
          {displayedTools.map((tool, index) => (
            <div
              key={`${tool.name}-${index}`}
              className="animate-in slide-in-from-left-2 fade-in-0 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ToolItem tool={tool} onBookmark={onBookmark} isBookmarked={isToolBookmarked(tool)} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        {hasMoreTools && (
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                setShowAllTools(!showAllTools)
              }}
              className="w-full justify-center text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-accent/50"
            >
              {showAllTools ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1 transition-transform duration-200" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1 transition-transform duration-200" />
                  View All ({tools.length} tools)
                </>
              )}
            </Button>
          </div>
        )}

        {/* Expanded content when focused */}
        {isFocused && (
          <div className="mt-6 pt-6 border-t border-border animate-in slide-in-from-bottom-2 fade-in-0 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-card-foreground mb-2">Industry Overview</h4>
                <p className="text-sm text-muted-foreground">
                  Explore {tools.length} carefully curated AI tools for {industry.toLowerCase()} at the{" "}
                  {level.toLowerCase()} level. Each tool has been selected for its effectiveness, ease of use, and value
                  proposition.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-card-foreground mb-2">Getting Started</h4>
                <p className="text-sm text-muted-foreground">
                  Click on any tool name to visit their website, use the copy button to grab example prompts, or
                  bookmark tools to save them to your personal ToolNest collection.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
