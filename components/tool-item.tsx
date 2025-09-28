"use client"
import { Copy, Bookmark, ExternalLink } from "lucide-react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Tool {
  name: string
  logoUrl: string
  website: string
  prompt: string
  pricing?: string
}

interface ToolItemProps {
  tool: Tool
  onBookmark: (tool: Tool) => void
  isBookmarked: boolean
}

export function ToolItem({ tool, onBookmark, isBookmarked }: ToolItemProps) {
  const { toast } = useToast()

  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(tool.prompt)
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleVisitWebsite = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(tool.website, "_blank", "noopener,noreferrer")
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    onBookmark(tool)
    toast({
      title: isBookmarked ? "Removed from ToolNest" : "Added to ToolNest",
      description: `${tool.name} ${isBookmarked ? "removed from" : "added to"} your personal collection`,
    })
  }

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-all duration-200 group hover:scale-[1.01] hover:shadow-sm">
      <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
        <Image
          src={tool.logoUrl || "/placeholder.svg"}
          alt={`${tool.name} logo`}
          width={32}
          height={32}
          className="rounded-md"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <button
            onClick={handleVisitWebsite}
            className="font-medium text-card-foreground hover:text-primary transition-all duration-200 cursor-pointer text-left hover:underline decoration-primary/50 underline-offset-2"
          >
            {tool.name}
          </button>
          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0.5" />
          {tool.pricing && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full transition-all duration-200 ${
                tool.pricing === "Free"
                  ? "bg-green-500/20 text-green-400"
                  : tool.pricing === "Freemium"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-orange-500/20 text-orange-400"
              }`}
            >
              {tool.pricing}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-foreground/80">
          {tool.prompt}
        </p>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyPrompt}
            className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/10 hover:text-primary transform hover:scale-105"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={`h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-105 ${
              isBookmarked ? "text-primary opacity-100 hover:bg-primary/10" : "hover:bg-accent hover:text-foreground"
            }`}
          >
            <Bookmark className={`w-3 h-3 mr-1 transition-all duration-200 ${isBookmarked ? "fill-current" : ""}`} />
            {isBookmarked ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
}
