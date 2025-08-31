# 🍳 Smart Recipe Generator

A recipe recommendation app that suggests recipes based on available ingredients and dietary preferences.

## 🚀 Features
- Ingredient input (manual entry or mock AI recognition from images).
- Recipe filtering by:
  - Cooking time
  - Difficulty
  - Dietary preferences (Vegetarian, Vegan, Gluten-free, etc.)
- Adjustable serving sizes with auto ingredient scaling.
- Nutritional info (calories, protein, carbs, fat).
- Favorites + ratings system.
- Personalized recommendations.
- Fully responsive UI.

## 🛠 Tech Stack
- **Next.js + React**
- **TypeScript**
- **Tailwind CSS**
- **SWR (data fetching)**
- **Vercel** (hosting)

## 📂 Data
- Includes 20 pre-defined recipes (`/public/recipes.json`).

## 🏃‍♂️ Running Locally
```bash
# Clone repo
git clone https://github.com/Abhishekkk-007/smart-recipe-generator.git
cd smart-recipe-generator

# Install dependencies
npm install --legacy-peer-deps

# Run dev server
npm run dev
