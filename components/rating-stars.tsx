"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

type Props = {
  recipeId: string
  value: number
  onChange: (next: number) => void
  size?: number
}

export default function RatingStars({ recipeId, value, onChange, size = 20 }: Props) {
  const stars = useMemo(() => [1, 2, 3, 4, 5], [])
  return (
    <div className="flex items-center" role="radiogroup" aria-label="Rate this recipe">
      {stars.map((s) => {
        const filled = s <= value
        return (
          <button
            key={`${recipeId}-${s}`}
            role="radio"
            aria-checked={filled}
            className={cn(
              "mx-0.5 transition-colors",
              filled ? "text-amber-500" : "text-muted-foreground hover:text-amber-500",
            )}
            onClick={() => onChange(s)}
            title={`${s} star${s > 1 ? "s" : ""}`}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.91L18.18 22 12 18.77 5.82 22 7 14.18l-5-4.91 6.91-1.01L12 2z" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
