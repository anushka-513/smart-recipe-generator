"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Filters } from "@/lib/types"

const DIETS = ["vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free"] as const

type Props = {
  value: Filters
  onChange: (f: Filters) => void
}

export default function FiltersBar({ value, onChange }: Props) {
  const [maxTime, setMaxTime] = useState<number>(value.maxTime ?? 60)
  const [difficulty, setDifficulty] = useState<string>(value.difficulty ?? "any")
  const [diets, setDiets] = useState<string[]>(value.diets ?? [])

  useEffect(() => {
    onChange({
      maxTime,
      difficulty: difficulty as any,
      diets,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxTime, difficulty, diets])

  function toggleDiet(d: string) {
    setDiets((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label>Max cooking time: {maxTime} min</Label>
          <Slider min={5} max={120} step={5} value={[maxTime]} onValueChange={(v) => setMaxTime(v[0] ?? maxTime)} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Difficulty</Label>
          <Select value={difficulty} onValueChange={(v) => setDifficulty(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Dietary preferences</Label>
          <div className="grid grid-cols-2 gap-2">
            {DIETS.map((d) => (
              <label key={d} className="flex items-center gap-2">
                <Checkbox checked={diets.includes(d)} onCheckedChange={() => toggleDiet(d)} aria-label={d} />
                <span className="capitalize">{d.replace("-", " ")}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
