"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import RecipeCard from "@/components/recipe-card"
import RecipeModal from "@/components/recipe-modal"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Recipe } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function FavoritesPage() {
  const { toast } = useToast()
  const { data: recipes, error, isLoading } = useSWR<Recipe[]>("/recipes.json", fetcher)
  const [favorites, setFavorites] = useLocalStorage<string[]>("recipe:favorites", [])
  const [ratings, setRatings] = useLocalStorage<Record<string, number>>("recipe:ratings", {})
  const [selectedIngredients] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<Recipe | null>(null)

  const allRecipes = recipes ?? []
  const favRecipes = useMemo(() => allRecipes.filter((r) => favorites.includes(r.id)), [allRecipes, favorites])

  function toggleFavorite(id: string) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }
  function setRating(id: string, v: number) {
    setRatings((prev) => ({ ...prev, [id]: v }))
    toast({ title: "Thanks for rating!", description: `You rated this ${v} star${v > 1 ? "s" : ""}.` })
  }
  function openRecipe(r: Recipe) {
    setActive(r)
    setOpen(true)
  }

  if (error) {
    return (
      <main className="container mx-auto max-w-6xl p-4">
        <p className="text-destructive">Failed to load favorites.</p>
      </main>
    )
  }

  return (
    <main className="container mx-auto max-w-6xl p-4 font-sans">
      <header className="mb-6">
        <h1 className="text-balance text-2xl font-semibold">My Favorites</h1>
        <p className="text-pretty text-sm text-muted-foreground">Your saved recipes in one place.</p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl border bg-muted/30" />
          ))}
        </div>
      ) : favRecipes.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center">
          <h3 className="text-balance text-lg font-semibold">No favorites yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Go back to the homepage and tap the heart on any recipe.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favRecipes.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              selectedIngredients={selectedIngredients}
              onOpen={openRecipe}
              isFavorite={favorites.includes(r.id)}
              onToggleFavorite={() => toggleFavorite(r.id)}
              rating={ratings[r.id] ?? 0}
              onRate={(v) => setRating(r.id, v)}
            />
          ))}
        </div>
      )}

      <RecipeModal recipe={active} open={open} onOpenChange={setOpen} selectedIngredients={selectedIngredients} />
    </main>
  )
}
