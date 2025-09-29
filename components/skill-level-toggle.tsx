"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type SkillLevel = "Beginner" | "Intermediate" | "Advanced"

interface SkillLevelToggleProps {
  onLevelChange: (level: SkillLevel) => void
}

export function SkillLevelToggle({ onLevelChange }: SkillLevelToggleProps) {
  const [activeLevel, setActiveLevel] = useState<SkillLevel>("Beginner")

  const levels: SkillLevel[] = ["Beginner", "Intermediate", "Advanced"]

  // Helper function to determine the button's style based on its level and active state
  const getLevelStyles = (level: SkillLevel, isActive: boolean): string => {
    if (!isActive) {
      return "text-muted-foreground hover:text-foreground hover:bg-accent/50"
    }
    switch (level) {
      case "Beginner":
        return "bg-green-600 text-white hover:bg-green-700 shadow-sm animate-in zoom-in-95 duration-200"
      case "Intermediate":
        return "bg-primary text-primary-foreground shadow-sm animate-in zoom-in-95 duration-200"
      case "Advanced":
        return "bg-red-600 text-white hover:bg-red-700 shadow-sm animate-in zoom-in-95 duration-200"
      default:
        return "bg-primary text-primary-foreground" // Fallback style
    }
  }

  const handleLevelChange = (level: SkillLevel) => {
    setActiveLevel(level)
    onLevelChange(level)
  }

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex bg-muted rounded-lg p-1 transition-all duration-300 hover:shadow-md">
        {levels.map((level, index) => {
          const isActive = activeLevel === level
          // Get the dynamic styles for the current level
          const levelStyles = getLevelStyles(level, isActive)

          return (
            <Button
              key={level}
              // The variant is now determined by the active state, and colors are handled by `levelStyles`
              variant={isActive ? "default" : "ghost"}
              className={`px-6 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${levelStyles}`}
              onClick={() => handleLevelChange(level)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {level}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
