import type { NextRequest } from "next/server"

const SAMPLE_INGREDIENTS = [
  "tomato",
  "onion",
  "garlic",
  "olive oil",
  "chicken breast",
  "tofu",
  "pasta",
  "rice",
  "egg",
  "milk",
  "spinach",
  "bell pepper",
  "carrot",
  "cheddar",
  "mozzarella",
  "black beans",
  "lentils",
  "yogurt",
  "oats",
  "banana",
  "salmon",
  "broccoli",
  "zucchini",
  "mushroom",
  "potato",
  "avocado",
  "lime",
  "cilantro",
  "soy sauce",
  "ginger",
]

function pseudoRandomFromString(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i)
  return () => {
    // simple LCG
    h = (h * 1664525 + 1013904223) % 4294967296
    return Math.abs(h) / 4294967296
  }
}

export async function POST(req: NextRequest) {
  try {
    const { filename } = (await req.json()) as { filename?: string }
    const seed = filename ?? "default"
    const rand = pseudoRandomFromString(seed)
    const count = 4 + Math.floor(rand() * 4) // 4-7 ingredients
    const picks = new Set<string>()
    while (picks.size < count) {
      const idx = Math.floor(rand() * SAMPLE_INGREDIENTS.length)
      picks.add(SAMPLE_INGREDIENTS[idx]!)
    }
    // simulate latency
    await new Promise((r) => setTimeout(r, 700))
    return Response.json({ ingredients: Array.from(picks) })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? "Bad request" }), { status: 400 })
  }
}
