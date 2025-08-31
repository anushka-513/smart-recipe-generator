"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FavoriteToggle from "./favorite-toggle"
import RatingStars from "./rating-stars"
import type { Recipe } from "@/lib/types"

type Props = {
  recipe: Recipe
  selectedIngredients: string[]
  onOpen: (r: Recipe) => void
  isFavorite: boolean
  onToggleFavorite: () => void
  rating: number
  onRate: (v: number) => void
}

export default function RecipeCard({
  recipe,
  selectedIngredients,
  onOpen,
  isFavorite,
  onToggleFavorite,
  rating,
  onRate,
}: Props) {
  const have = new Set(selectedIngredients.map((s) => s.toLowerCase()))

  // ✅ Normalize ingredients: handle strings or { name: string }
  const ingArray: any[] = Array.isArray(recipe.ingredients) ? recipe.ingredients : []
  const normalizedIngs = ingArray.map((i) => (typeof i === "string" ? i : i?.name ?? ""))

  const missing = normalizedIngs.filter((i) => !have.has(i.toLowerCase()))

  const img = recipe.image_url || recipe.image || "/vibrant-food-dish.png"

  return (
    <Card className="overflow-hidden rounded-xl shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <button
        className="w-full text-left"
        onClick={() => onOpen(recipe)}
        aria-label={`Open ${recipe.title}`}
      >
        <img
          src={img || "/placeholder.svg"}
          alt={recipe.title}
          loading="lazy"
          className="h-48 w-full object-cover"
        />
      </button>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-pretty text-xl font-semibold leading-tight">
            {recipe.title}
          </CardTitle>
          <FavoriteToggle active={isFavorite} onToggle={onToggleFavorite} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>⏱ {recipe.time}m</span>
          <span>•</span>
          <span className="capitalize">⚙️ {recipe.difficulty}</span>
          <span>•</span>
          <span>🔥 {recipe.nutrition?.calories ?? "—"} cal</span>
          <span>•</span>
          <span>🍗 {recipe.nutrition?.protein ?? "—"}g</span>
          <span>•</span>
          <span>🍞 {recipe.nutrition?.carbs ?? "—"}g</span>
          <span>•</span>
          <span>🧈 {recipe.nutrition?.fat ?? "—"}g</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {missing.length === 0 ? (
              <span className="text-emerald-600">All ingredients on hand</span>
            ) : (
              <span>
                Missing: {missing.slice(0, 3).join(", ")}
                {missing.length > 3 ? "…" : ""}
              </span>
            )}
          </div>
          <RatingStars recipeId={recipe.id} value={rating} onChange={onRate} />
        </div>
      </CardContent>
    </Card>
  )
}
