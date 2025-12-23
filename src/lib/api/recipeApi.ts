// Recipe API service using TheMealDB (free, no API key required)
// This provides access to thousands of recipes dynamically

export interface ApiRecipe {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  area: string;
  difficulty: "Easy" | "Medium" | "Hard";
  cookingTime: number;
  servings: number;
  ingredients: ApiIngredient[];
  instructions: string[];
  videoUrl?: string;
  tags?: string[];
}

export interface ApiIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  original: string;
}

interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  [key: string]: string | null;
}

interface MealDBResponse {
  meals: MealDBMeal[] | null;
}

interface CategoryResponse {
  categories: Array<{
    idCategory: string;
    strCategory: string;
    strCategoryThumb: string;
    strCategoryDescription: string;
  }>;
}

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Parse ingredients from MealDB format
const parseIngredients = (meal: MealDBMeal): ApiIngredient[] => {
  const ingredients: ApiIngredient[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim()) {
      const parsed = parseMeasure(measure || "");
      ingredients.push({
        id: `ing-${i}`,
        name: ingredient.trim(),
        quantity: parsed.quantity,
        unit: parsed.unit,
        original: `${measure || ""} ${ingredient}`.trim(),
      });
    }
  }
  
  return ingredients;
};

// Parse measure string into quantity and unit
const parseMeasure = (measure: string): { quantity: number; unit: string } => {
  if (!measure || !measure.trim()) {
    return { quantity: 1, unit: "piece" };
  }
  
  const cleaned = measure.trim().toLowerCase();
  
  // Match patterns like "2 cups", "1/2 tsp", "200g"
  const fractionMatch = cleaned.match(/^(\d+)\/(\d+)\s*(.*)$/);
  if (fractionMatch) {
    const num = parseInt(fractionMatch[1]);
    const denom = parseInt(fractionMatch[2]);
    return { quantity: num / denom, unit: fractionMatch[3] || "piece" };
  }
  
  const mixedMatch = cleaned.match(/^(\d+)\s+(\d+)\/(\d+)\s*(.*)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1]);
    const num = parseInt(mixedMatch[2]);
    const denom = parseInt(mixedMatch[3]);
    return { quantity: whole + num / denom, unit: mixedMatch[4] || "piece" };
  }
  
  const numMatch = cleaned.match(/^([\d.]+)\s*(.*)$/);
  if (numMatch) {
    return { quantity: parseFloat(numMatch[1]) || 1, unit: numMatch[2] || "piece" };
  }
  
  return { quantity: 1, unit: cleaned };
};

// Estimate difficulty based on instruction length and ingredient count
const estimateDifficulty = (instructions: string, ingredientCount: number): "Easy" | "Medium" | "Hard" => {
  const steps = instructions.split(/\r?\n/).filter(s => s.trim()).length;
  
  if (steps <= 4 && ingredientCount <= 6) return "Easy";
  if (steps <= 8 && ingredientCount <= 12) return "Medium";
  return "Hard";
};

// Estimate cooking time based on instruction complexity
const estimateCookingTime = (instructions: string): number => {
  const lower = instructions.toLowerCase();
  
  if (lower.includes("overnight") || lower.includes("hours")) return 120;
  if (lower.includes("hour")) return 60;
  if (lower.includes("simmer") || lower.includes("bake") || lower.includes("roast")) return 45;
  if (lower.includes("fry") || lower.includes("sauté")) return 25;
  
  const steps = instructions.split(/\r?\n/).filter(s => s.trim()).length;
  return Math.max(15, steps * 5);
};

// Transform MealDB meal to our format
const transformMeal = (meal: MealDBMeal): ApiRecipe => {
  const ingredients = parseIngredients(meal);
  const instructions = meal.strInstructions
    .split(/\r?\n/)
    .filter(s => s.trim())
    .map(s => s.replace(/^\d+\.\s*/, "").trim());
  
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    description: `A delicious ${meal.strArea || ""} ${meal.strCategory || "dish"} - ${meal.strMeal}`.trim(),
    image: meal.strMealThumb,
    category: meal.strCategory || "Main",
    area: meal.strArea || "International",
    difficulty: estimateDifficulty(meal.strInstructions, ingredients.length),
    cookingTime: estimateCookingTime(meal.strInstructions),
    servings: 4,
    ingredients,
    instructions,
    videoUrl: meal.strYoutube || undefined,
    tags: meal.strTags?.split(",").map(t => t.trim()).filter(Boolean) || [],
  };
};

// API Functions
export const searchRecipesByName = async (query: string): Promise<ApiRecipe[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
    const data: MealDBResponse = await response.json();
    
    if (!data.meals) return [];
    return data.meals.map(transformMeal);
  } catch (error) {
    console.error("Error searching recipes:", error);
    return [];
  }
};

export const searchRecipesByIngredient = async (ingredient: string): Promise<ApiRecipe[]> => {
  try {
    // First get list of meals with this ingredient
    const listResponse = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
    const listData = await listResponse.json();
    
    if (!listData.meals) return [];
    
    // Get full details for first 12 meals
    const mealIds = listData.meals.slice(0, 12).map((m: { idMeal: string }) => m.idMeal);
    const recipes = await Promise.all(mealIds.map(getRecipeById));
    
    return recipes.filter((r): r is ApiRecipe => r !== null);
  } catch (error) {
    console.error("Error searching by ingredient:", error);
    return [];
  }
};

export const getRecipeById = async (id: string): Promise<ApiRecipe | null> => {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data: MealDBResponse = await response.json();
    
    if (!data.meals || data.meals.length === 0) return null;
    return transformMeal(data.meals[0]);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }
};

export const getRecipesByCategory = async (category: string): Promise<ApiRecipe[]> => {
  try {
    const listResponse = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    const listData = await listResponse.json();
    
    if (!listData.meals) return [];
    
    // Get full details for first 12 meals
    const mealIds = listData.meals.slice(0, 12).map((m: { idMeal: string }) => m.idMeal);
    const recipes = await Promise.all(mealIds.map(getRecipeById));
    
    return recipes.filter((r): r is ApiRecipe => r !== null);
  } catch (error) {
    console.error("Error fetching category recipes:", error);
    return [];
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/categories.php`);
    const data: CategoryResponse = await response.json();
    
    return data.categories.map(c => c.strCategory);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return ["Beef", "Chicken", "Dessert", "Lamb", "Pasta", "Pork", "Seafood", "Vegetarian"];
  }
};

export const getRandomRecipe = async (): Promise<ApiRecipe | null> => {
  try {
    const response = await fetch(`${BASE_URL}/random.php`);
    const data: MealDBResponse = await response.json();
    
    if (!data.meals || data.meals.length === 0) return null;
    return transformMeal(data.meals[0]);
  } catch (error) {
    console.error("Error fetching random recipe:", error);
    return null;
  }
};

export const getFeaturedRecipes = async (count: number = 6): Promise<ApiRecipe[]> => {
  try {
    // Get random recipes for featured section
    const recipes = await Promise.all(
      Array.from({ length: count }, () => getRandomRecipe())
    );
    
    // Filter out nulls and duplicates
    const uniqueRecipes = recipes
      .filter((r): r is ApiRecipe => r !== null)
      .filter((recipe, index, self) => 
        index === self.findIndex(r => r.id === recipe.id)
      );
    
    return uniqueRecipes;
  } catch (error) {
    console.error("Error fetching featured recipes:", error);
    return [];
  }
};

export const getLatestRecipes = async (): Promise<ApiRecipe[]> => {
  try {
    // Get a variety of recipes from different categories
    const categories = ["Chicken", "Beef", "Pasta", "Seafood", "Vegetarian", "Dessert"];
    const allRecipes: ApiRecipe[] = [];
    
    for (const category of categories.slice(0, 3)) {
      const recipes = await getRecipesByCategory(category);
      allRecipes.push(...recipes.slice(0, 4));
    }
    
    return allRecipes;
  } catch (error) {
    console.error("Error fetching latest recipes:", error);
    return [];
  }
};