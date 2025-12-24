import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// TheMealDB API (free, no key required)
const MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Mock fallback data
const MOCK_RECIPES = [
  {
    id: "mock-1",
    name: "Classic Spaghetti Carbonara",
    description: "A creamy Italian pasta dish with eggs, cheese, and pancetta",
    image: "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg",
    category: "Pasta",
    area: "Italian",
    difficulty: "Medium",
    cookingTime: 30,
    servings: 4,
    ingredients: [
      { id: "1", name: "Spaghetti", quantity: 400, unit: "g", original: "400g Spaghetti" },
      { id: "2", name: "Eggs", quantity: 4, unit: "piece", original: "4 Eggs" },
      { id: "3", name: "Pancetta", quantity: 200, unit: "g", original: "200g Pancetta" },
      { id: "4", name: "Parmesan", quantity: 100, unit: "g", original: "100g Parmesan" },
      { id: "5", name: "Black Pepper", quantity: 1, unit: "tsp", original: "1 tsp Black Pepper" },
    ],
    instructions: [
      "Cook pasta in salted boiling water until al dente",
      "Fry pancetta until crispy",
      "Beat eggs with grated parmesan",
      "Toss hot pasta with pancetta, remove from heat",
      "Add egg mixture and toss quickly",
      "Season with black pepper and serve"
    ],
    tags: ["pasta", "italian", "quick"]
  },
  {
    id: "mock-2",
    name: "Chicken Tikka Masala",
    description: "Creamy tomato-based curry with tender chicken pieces",
    image: "https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg",
    category: "Chicken",
    area: "Indian",
    difficulty: "Medium",
    cookingTime: 45,
    servings: 4,
    ingredients: [
      { id: "1", name: "Chicken Breast", quantity: 500, unit: "g", original: "500g Chicken Breast" },
      { id: "2", name: "Yogurt", quantity: 200, unit: "ml", original: "200ml Yogurt" },
      { id: "3", name: "Tomato Sauce", quantity: 400, unit: "g", original: "400g Tomato Sauce" },
      { id: "4", name: "Cream", quantity: 200, unit: "ml", original: "200ml Cream" },
      { id: "5", name: "Garam Masala", quantity: 2, unit: "tbsp", original: "2 tbsp Garam Masala" },
    ],
    instructions: [
      "Marinate chicken in yogurt and spices for 2 hours",
      "Grill or bake chicken until charred",
      "Make sauce with tomatoes, cream, and spices",
      "Add chicken to sauce and simmer",
      "Serve with rice or naan"
    ],
    tags: ["curry", "indian", "spicy"]
  },
  {
    id: "mock-3",
    name: "Beef Tacos",
    description: "Mexican-style tacos with seasoned ground beef and fresh toppings",
    image: "https://www.themealdb.com/images/media/meals/ypxvwv1505333929.jpg",
    category: "Beef",
    area: "Mexican",
    difficulty: "Easy",
    cookingTime: 25,
    servings: 4,
    ingredients: [
      { id: "1", name: "Ground Beef", quantity: 500, unit: "g", original: "500g Ground Beef" },
      { id: "2", name: "Taco Shells", quantity: 12, unit: "piece", original: "12 Taco Shells" },
      { id: "3", name: "Lettuce", quantity: 1, unit: "head", original: "1 head Lettuce" },
      { id: "4", name: "Tomatoes", quantity: 2, unit: "piece", original: "2 Tomatoes" },
      { id: "5", name: "Cheese", quantity: 150, unit: "g", original: "150g Cheese" },
    ],
    instructions: [
      "Brown the ground beef with taco seasoning",
      "Warm taco shells in oven",
      "Chop lettuce and dice tomatoes",
      "Grate cheese",
      "Assemble tacos with all toppings"
    ],
    tags: ["mexican", "quick", "family"]
  }
];

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

// Parse measure string into quantity and unit
const parseMeasure = (measure: string): { quantity: number; unit: string } => {
  if (!measure || !measure.trim()) {
    return { quantity: 1, unit: "piece" };
  }
  
  const cleaned = measure.trim().toLowerCase();
  
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

// Parse ingredients from MealDB format
const parseIngredients = (meal: MealDBMeal) => {
  const ingredients = [];
  
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

// Estimate difficulty
const estimateDifficulty = (instructions: string, ingredientCount: number): string => {
  const steps = instructions.split(/\r?\n/).filter(s => s.trim()).length;
  if (steps <= 4 && ingredientCount <= 6) return "Easy";
  if (steps <= 8 && ingredientCount <= 12) return "Medium";
  return "Hard";
};

// Estimate cooking time
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
const transformMeal = (meal: MealDBMeal) => {
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

// Scale ingredients based on servings
const scaleIngredients = (ingredients: any[], originalServings: number, newServings: number) => {
  const ratio = newServings / originalServings;
  return ingredients.map(ing => ({
    ...ing,
    quantity: Math.round((ing.quantity * ratio) * 100) / 100,
    original: `${Math.round((ing.quantity * ratio) * 100) / 100} ${ing.unit} ${ing.name}`
  }));
};

// Fetch from MealDB with fallback
async function fetchFromMealDB(endpoint: string) {
  try {
    console.log(`Fetching from MealDB: ${endpoint}`);
    const response = await fetch(`${MEALDB_BASE_URL}${endpoint}`, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`MealDB API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("MealDB fetch error:", error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    
    console.log(`Recipe API called with action: ${action}`);

    let result;

    switch (action) {
      case 'search': {
        const query = url.searchParams.get('q') || '';
        const byIngredient = url.searchParams.get('byIngredient') === 'true';
        
        if (byIngredient) {
          const data = await fetchFromMealDB(`/filter.php?i=${encodeURIComponent(query)}`);
          if (data?.meals) {
            const mealIds = data.meals.slice(0, 12).map((m: any) => m.idMeal);
            const recipes = await Promise.all(
              mealIds.map(async (id: string) => {
                const detail = await fetchFromMealDB(`/lookup.php?i=${id}`);
                return detail?.meals?.[0] ? transformMeal(detail.meals[0]) : null;
              })
            );
            result = recipes.filter(Boolean);
          } else {
            result = MOCK_RECIPES.filter(r => 
              r.ingredients.some(i => i.name.toLowerCase().includes(query.toLowerCase()))
            );
          }
        } else {
          const data = await fetchFromMealDB(`/search.php?s=${encodeURIComponent(query)}`);
          result = data?.meals ? data.meals.map(transformMeal) : 
            MOCK_RECIPES.filter(r => r.name.toLowerCase().includes(query.toLowerCase()));
        }
        break;
      }

      case 'getById': {
        const id = url.searchParams.get('id');
        if (!id) {
          return new Response(
            JSON.stringify({ error: 'Missing recipe ID' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Check if it's a mock ID
        if (id.startsWith('mock-')) {
          result = MOCK_RECIPES.find(r => r.id === id) || null;
        } else {
          const data = await fetchFromMealDB(`/lookup.php?i=${id}`);
          result = data?.meals?.[0] ? transformMeal(data.meals[0]) : null;
        }
        break;
      }

      case 'getByCategory': {
        const category = url.searchParams.get('category') || '';
        const data = await fetchFromMealDB(`/filter.php?c=${encodeURIComponent(category)}`);
        
        if (data?.meals) {
          const mealIds = data.meals.slice(0, 12).map((m: any) => m.idMeal);
          const recipes = await Promise.all(
            mealIds.map(async (id: string) => {
              const detail = await fetchFromMealDB(`/lookup.php?i=${id}`);
              return detail?.meals?.[0] ? transformMeal(detail.meals[0]) : null;
            })
          );
          result = recipes.filter(Boolean);
        } else {
          result = MOCK_RECIPES.filter(r => r.category.toLowerCase() === category.toLowerCase());
        }
        break;
      }

      case 'getCategories': {
        const data = await fetchFromMealDB('/categories.php');
        result = data?.categories 
          ? data.categories.map((c: any) => c.strCategory)
          : ["Beef", "Chicken", "Dessert", "Lamb", "Pasta", "Pork", "Seafood", "Vegetarian"];
        break;
      }

      case 'getRandom': {
        const data = await fetchFromMealDB('/random.php');
        result = data?.meals?.[0] ? transformMeal(data.meals[0]) : MOCK_RECIPES[0];
        break;
      }

      case 'getFeatured': {
        const count = parseInt(url.searchParams.get('count') || '6');
        const recipes = await Promise.all(
          Array.from({ length: count }, async () => {
            const data = await fetchFromMealDB('/random.php');
            return data?.meals?.[0] ? transformMeal(data.meals[0]) : null;
          })
        );
        const unique = recipes.filter((r, i, arr) => 
          r && arr.findIndex(x => x?.id === r.id) === i
        );
        result = unique.length > 0 ? unique : MOCK_RECIPES.slice(0, count);
        break;
      }

      case 'getLatest': {
        const categories = ["Chicken", "Beef", "Pasta"];
        const allRecipes: any[] = [];
        
        for (const cat of categories) {
          const data = await fetchFromMealDB(`/filter.php?c=${cat}`);
          if (data?.meals) {
            const mealIds = data.meals.slice(0, 4).map((m: any) => m.idMeal);
            const recipes = await Promise.all(
              mealIds.map(async (id: string) => {
                const detail = await fetchFromMealDB(`/lookup.php?i=${id}`);
                return detail?.meals?.[0] ? transformMeal(detail.meals[0]) : null;
              })
            );
            allRecipes.push(...recipes.filter(Boolean));
          }
        }
        
        result = allRecipes.length > 0 ? allRecipes : MOCK_RECIPES;
        break;
      }

      case 'scaleServings': {
        const body = await req.json();
        const { ingredients, originalServings, newServings } = body;
        
        if (!ingredients || !originalServings || !newServings) {
          return new Response(
            JSON.stringify({ error: 'Missing required parameters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        result = scaleIngredients(ingredients, originalServings, newServings);
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action', availableActions: [
            'search', 'getById', 'getByCategory', 'getCategories', 
            'getRandom', 'getFeatured', 'getLatest', 'scaleServings'
          ]}),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`Returning ${Array.isArray(result) ? result.length : 1} result(s)`);
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', fallback: MOCK_RECIPES }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
