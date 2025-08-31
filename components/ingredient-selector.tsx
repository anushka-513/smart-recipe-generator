"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import type { Recipe } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Props = {
  selected: string[]
  onChange: (next: string[]) => void
}

export default function IngredientSelector({ selected, onChange }: Props) {
  const { toast } = useToast()
  const { data: recipes } = useSWR<Recipe[]>("/recipes.json", fetcher)
  const [input, setInput] = useState("")
  const [uploading, setUploading] = useState(false)

  // ✅ FIXED: supports both string and object ingredients
  const suggestions = useMemo(() => {
    const set = new Set<string>()
    recipes?.forEach((r) =>
      r.ingredients.forEach((i: any) =>
        set.add((typeof i === "string" ? i : i.name).toLowerCase())
      )
    )
    return Array.from(set).sort()
  }, [recipes])

  function addIngredient(name: string) {
    const n = name.trim().toLowerCase()
    if (!n) return
    if (!selected.includes(n)) onChange([...selected, n])
    setInput("")
  }

  function removeIngredient(name: string) {
    onChange(selected.filter((s) => s !== name))
  }

  async function handleMockRecognize(file?: File) {
    if (!file) return
    setUploading(true)
    try {
      const res = await fetch("/api/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name }),
      })
      if (!res.ok) throw new Error("Failed to recognize")
      const { ingredients } = (await res.json()) as { ingredients: string[] }
      const merged = Array.from(new Set([...selected, ...ingredients.map((i) => i.toLowerCase())]))
      onChange(merged)
      toast({ title: "AI recognition complete", description: `Found ${ingredients.length} ingredients.` })
    } catch (e: any) {
      toast({ title: "Recognition failed", description: e?.message ?? "Unknown error", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="ingredient">Add ingredient</Label>
        <div className="flex gap-2">
          <Input
            id="ingredient"
            list="ingredient-suggestions"
            value={input}
            placeholder="e.g., tomato, pasta, chicken..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addIngredient(input)
              }
            }}
          />
          <Button type="button" onClick={() => addIngredient(input)} variant="default">
            Add
          </Button>
        </div>
        <datalist id="ingredient-suggestions">
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      <div>
        <Label>Selected ingredients</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.length === 0 ? (
            <span className="text-sm text-muted-foreground">No ingredients selected yet.</span>
          ) : null}
          {selected.map((s) => (
            <Badge key={s} variant="secondary" className="flex items-center gap-2">
              {s}
              <button
                aria-label={`Remove ${s}`}
                className="rounded px-1 hover:bg-muted"
                onClick={() => removeIngredient(s)}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <Label>Or upload an image (mock AI)</Label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleMockRecognize(e.target.files?.[0] ?? undefined)}
          aria-label="Upload ingredient image"
        />
        <Button type="button" variant="outline" disabled={uploading}>
          {uploading ? "Recognizing…" : "Run AI on image"}
        </Button>
        <p className="text-xs text-muted-foreground">
          This uses a placeholder API. You can later replace it with real AI to detect ingredients from images.
        </p>
      </div>
    </div>
  )
}
