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

  const handleLevelChange = (level: SkillLevel) => {
    setActiveLevel(level)
    onLevelChange(level)
  }

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex bg-muted rounded-lg p-1 transition-all duration-300 hover:shadow-md">
        {levels.map((level, index) => (
          <Button
            key={level}
            variant={activeLevel === level ? "default" : "ghost"}
            className={`px-6 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
              activeLevel === level
                ? "bg-primary text-primary-foreground shadow-sm animate-in zoom-in-95 duration-200"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
            onClick={() => handleLevelChange(level)}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {level}
          </Button>
        ))}
      </div>
    </div>
  )
}
