export type Difficulty = "easy" | "medium" | "hard"

export type Nutrients = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type Ingredient = {
  name: string
  quantity: number
  unit?: string
  optional?: boolean
  substitutions?: string[]
}

export type Recipe = {
  id: string
  title: string
  image?: string
  image_url?: string
  time: number // minutes
  difficulty: Difficulty
  servings: number
  ingredients: Ingredient[]
  steps: string[]
  nutrition: Nutrients
  tags: string[] // e.g. ["italian", "pasta"]
  diets?: string[] // e.g. ["vegetarian","vegan","gluten-free","dairy-free","nut-free"]
}

export type Filters = {
  maxTime?: number
  difficulty?: Difficulty | "any"
  diets?: string[]
}
