"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import IngredientSelector from "@/components/ingredient-selector"
import FiltersBar from "@/components/filters"
import RecipeCard from "@/components/recipe-card"
import RecipeModal from "@/components/recipe-modal"
import RecommendedRecipes from "@/components/recommended-recipes"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Recipe, Filters } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function HomePage() {
  const { toast } = useToast()
  const { data: recipes, error, isLoading } = useSWR<Recipe[]>("/recipes.json", fetcher)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [filters, setFilters] = useState<Filters>({ maxTime: 60, difficulty: "any", diets: [] })
  const [favorites, setFavorites] = useLocalStorage<string[]>("recipe:favorites", [])
  const [ratings, setRatings] = useLocalStorage<Record<string, number>>("recipe:ratings", {})
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<Recipe | null>(null)

  const allRecipes = recipes ?? []

  const filtered = useMemo(() => {
    const have = new Set(selectedIngredients.map((s) => s.toLowerCase()))
    return allRecipes
      .filter((r) => (filters.maxTime ? r.time <= filters.maxTime : true))
      .filter((r) => (filters.difficulty && filters.difficulty !== "any" ? r.difficulty === filters.difficulty : true))
      .filter((r) => (filters.diets?.length ? (r.diets ?? []).some((d) => filters.diets?.includes(d)) : true))
      .map((r) => {
        const total = r.ingredients.length
        const matches = r.ingredients.filter((i) => have.has(i.toLowerCase())).length
        const score = matches / Math.max(total, 1)
        return { recipe: r, score }
      })
      .sort((a, b) => b.score - a.score)
      .map((x) => x.recipe)
  }, [allRecipes, selectedIngredients, filters])

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
        <p className="text-destructive">Failed to load recipes.</p>
      </main>
    )
  }

  return (
    <main className="container mx-auto max-w-6xl p-4 font-sans">
      <header className="mb-8 flex flex-col gap-4">
        <h1 className="text-balance text-3xl font-semibold">Smart Recipe Generator</h1>
        <p className="text-pretty text-sm text-muted-foreground">
          Enter ingredients you have, set preferences, and we’ll suggest recipes. Use the mock AI to recognize
          ingredients from an image.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="rounded-lg border p-4">
            <IngredientSelector selected={selectedIngredients} onChange={setSelectedIngredients} />
            <div className="mt-4 flex items-center gap-2">
              <Button variant="secondary" onClick={() => setSelectedIngredients([])}>
                Clear ingredients
              </Button>
              <Button variant="default" onClick={() => setFilters({ maxTime: 60, difficulty: "any", diets: [] })}>
                Reset filters
              </Button>
            </div>
          </div>

          <FiltersBar value={filters} onChange={setFilters} />
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-medium">Your favorites</h2>
            <p className="text-sm text-muted-foreground">Tap the heart on any card to save.</p>
            <Separator className="my-3" />
            <div className="flex flex-col gap-2">
              {favorites.length === 0 ? (
                <span className="text-sm text-muted-foreground">No favorites yet.</span>
              ) : (
                favorites
                  .map((id) => allRecipes.find((r) => r.id === id))
                  .filter(Boolean)
                  .slice(0, 6)
                  .map((r) => {
                    const img = r!.image_url || r!.image || "/favorite-things.png"
                    return (
                      <button key={r!.id} onClick={() => openRecipe(r!)} className="flex items-center gap-3 text-left">
                        <img
                          src={img || "/placeholder.svg"}
                          alt={r!.title}
                          loading="lazy"
                          className="h-10 w-16 rounded object-cover"
                        />
                        <span className="text-sm">{r!.title}</span>
                      </button>
                    )
                  })
              )}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-medium">Filters</h2>
            <p className="text-sm text-muted-foreground">Quick summary</p>
            <Separator className="my-3" />
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Max time: {filters.maxTime ?? "—"} min</li>
              <li>Difficulty: {filters.difficulty ?? "any"}</li>
              <li>Diets: {filters.diets?.length ? filters.diets.join(", ") : "any"}</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="mt-8">
        <RecommendedRecipes recipes={allRecipes} favorites={favorites} ratings={ratings} />
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium">Recipe suggestions</h2>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            {isLoading ? (
              <>
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-muted-foreground" />
                Loading…
              </>
            ) : (
              `${filtered.length} result${filtered.length === 1 ? "" : "s"}`
            )}
          </span>
        </div>
        {!isLoading && filtered.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center">
            <h3 className="text-balance text-lg font-semibold">No recipes found 🍲 Try different ingredients.</h3>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button variant="secondary" onClick={() => setSelectedIngredients([])}>
                Clear ingredients
              </Button>
              <Button variant="default" onClick={() => setFilters({ maxTime: 60, difficulty: "any", diets: [] })}>
                Reset filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(isLoading ? Array.from({ length: 6 }).map((_, i) => i) : filtered).map((r: any, idx: number) =>
              isLoading ? (
                <div key={idx} className="h-64 animate-pulse rounded-xl border bg-muted/30" />
              ) : (
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
              ),
            )}
          </div>
        )}
      </section>

      <RecipeModal recipe={active} open={open} onOpenChange={setOpen} selectedIngredients={selectedIngredients} />
    </main>
  )
}
