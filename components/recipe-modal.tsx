"use client"

import { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import type { Recipe } from "@/lib/types"

type Props = {
  recipe?: Recipe | null
  open: boolean
  onOpenChange: (v: boolean) => void
  selectedIngredients: string[]
}

// simple formatter; kept if you later add numeric quantities
function formatQty(n: number) {
  return Number.parseFloat(n.toFixed(2)).toString()
}

export default function RecipeModal({ recipe, open, onOpenChange, selectedIngredients }: Props) {
  // Base servings fallback to 2 if undefined or invalid
  const baseServings = Math.max(1, Number.isFinite((recipe as any)?.servings) ? (recipe as any).servings : 2)
  const [servings, setServings] = useState<number>(baseServings)

  // keep servings in sync when recipe changes
  useMemo(() => setServings(baseServings), [/* only when recipe id changes */ (recipe as any)?.id])

  // scaling factor — only meaningful if you later use numeric quantities
  const factor = useMemo(() => {
    return Math.max(1 / baseServings, servings / baseServings)
  }, [baseServings, servings])

  // Normalize selected list to lowercase
  const have = new Set(selectedIngredients.map((s) => (s ?? "").toLowerCase()))

  // ✅ Normalize ingredients: supports strings or { name: string, ... }
  const ingArray: any[] = Array.isArray(recipe?.ingredients) ? (recipe!.ingredients as any[]) : []
  const normalizedIngs: string[] = ingArray
    .map((i) => (typeof i === "string" ? i : i?.name ?? ""))
    .filter(Boolean)

  const missing = useMemo(
    () => normalizedIngs.filter((i) => !have.has(i.toLowerCase())),
    [normalizedIngs, have]
  )

  const img =
    ((recipe as any)?.image_url as string | undefined) ||
    ((recipe as any)?.image as string | undefined) ||
    "/recipe-detail-image.png"

  const nutrition = (recipe as any)?.nutrition ?? {}
  const calories = nutrition?.calories ?? "—"
  const protein = nutrition?.protein ?? "—"
  const carbs = nutrition?.carbs ?? "—"
  const fat = nutrition?.fat ?? "—"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-pretty text-2xl font-semibold">
            {(recipe as any)?.title ?? "Recipe"}
          </DialogTitle>
        </DialogHeader>

        {recipe ? (
          <div className="flex flex-col gap-5">
            <img
              src={img || "/placeholder.svg"}
              alt={(recipe as any)?.title ?? "Recipe image"}
              loading="lazy"
              className="h-64 w-full rounded-lg object-cover"
            />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border p-3 text-center">
                <div className="text-xs text-muted-foreground">Calories</div>
                <div className="text-lg font-semibold">🔥 {calories}</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-xs text-muted-foreground">Protein</div>
                <div className="text-lg font-semibold">🍗 {protein}g</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-xs text-muted-foreground">Carbs</div>
                <div className="text-lg font-semibold">🍞 {carbs}g</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-xs text-muted-foreground">Fat</div>
                <div className="text-lg font-semibold">🧈 {fat}g</div>
              </div>
            </div>

            {/* Servings */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="servings">Servings</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Base: {baseServings}</span>
                  <Input
                    id="servings"
                    type="number"
                    min={1}
                    max={16}
                    step={1}
                    value={servings}
                    onChange={(e) => {
                      const n = Number.parseInt(e.target.value || "1", 10)
                      setServings(Number.isFinite(n) ? Math.min(16, Math.max(1, n)) : 1)
                    }}
                    className="h-8 w-20"
                  />
                </div>
              </div>
              <Slider min={1} max={16} step={1} value={[servings]} onValueChange={(v) => setServings(v[0] ?? servings)} />
            </div>

            {/* Ingredients + Steps */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Ingredients */}
              <div className="flex flex-col gap-2">
                <h3 className="font-medium">Ingredients</h3>
                <ul className="space-y-2">
                  {normalizedIngs.map((name, idx) => {
                    const hasIt = have.has(name.toLowerCase())
                    return (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span
                          aria-hidden="true"
                          className={hasIt ? "text-emerald-600" : "text-muted-foreground"}
                          title={hasIt ? "You have this" : "You might be missing this"}
                        >
                          {hasIt ? "✔︎" : "○"}
                        </span>
                        {/* If you later add structured qty/unit, you can render with formatQty(quantity * factor) */}
                        <span>{name}</span>
                      </li>
                    )
                  })}
                </ul>

                {/* Missing summary */}
                {missing.length > 0 ? (
                  <div className="mt-2 rounded-md border p-2">
                    <p className="text-sm font-medium">Missing</p>
                    <p className="text-sm text-muted-foreground">
                      {missing.slice(0, 8).join(", ")}
                      {missing.length > 8 ? "…" : ""}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-emerald-600">You have all ingredients.</p>
                )}
              </div>

              {/* Steps */}
              <div className="flex flex-col gap-2">
                <h3 className="font-medium">Steps</h3>
                <ol className="list-inside list-decimal space-y-2 text-sm">
                  {(recipe.steps ?? []).map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
