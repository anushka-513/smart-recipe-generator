"use client"

import { useMemo } from "react"
import type { Recipe } from "@/lib/types"

type Props = {
  recipes: Recipe[]
  favorites: string[]
  ratings: Record<string, number>
}

export default function RecommendedRecipes({ recipes, favorites, ratings }: Props) {
  const recommended = useMemo(() => {
    if (recipes.length === 0) return []

    // Build preference profile from favorites and high ratings
    const preferredTags = new Map<string, number>()
    recipes.forEach((r) => {
      const liked = favorites.includes(r.id) || (ratings[r.id] ?? 0) >= 4
      if (liked) {
        (r.tags ?? []).forEach((t) =>
          preferredTags.set(t, (preferredTags.get(t) ?? 0) + 1)
        )
      }
    })

    // Score recipes by tag overlap + baseline (average rating if any)
    const scored = recipes.map((r) => {
      const tagScore = (r.tags ?? []).reduce(
        (acc, t) => acc + (preferredTags.get(t) ?? 0),
        0
      )
      const base = (ratings[r.id] ?? 0) / 5
      // exclude already-favorited recipes from top slots for variety
      const penalty = favorites.includes(r.id) ? -1 : 0
      return { recipe: r, score: tagScore + base + penalty }
    })

    scored.sort((a, b) => b.score - a.score)

    return scored
      .filter((s) => s.score > 0)
      .slice(0, 6)
      .map((s) => s.recipe)
  }, [recipes, favorites, ratings])

  if (recommended.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-medium">Recommended for you</h2>
      <p className="text-sm text-muted-foreground">Based on your likes and ratings</p>
      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommended.map((r) => {
          const img = r.image_url || r.image || "/recommended.png"
          return (
            <div key={r.id} className="rounded-md border p-3">
              <div className="flex items-center gap-3">
                <img
                  src={img || "/placeholder.svg"}
                  alt={r.title}
                  loading="lazy"
                  className="h-16 w-24 rounded object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-medium">{r.title}</span>
                  <span className="text-xs text-muted-foreground">
                    ⏱ {r.time}m • {r.nutrition.calories} cal
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
