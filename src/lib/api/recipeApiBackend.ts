// Recipe API service using Lovable Cloud backend
// This calls the edge function which handles external API calls and hides keys

import { supabase } from "@/integrations/supabase/client";

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

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/recipes`;

async function callRecipeApi<T>(action: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({ action, ...params });
  
  const response = await fetch(`${FUNCTION_URL}?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

async function callRecipeApiPost<T>(action: string, body: Record<string, any>): Promise<T> {
  const searchParams = new URLSearchParams({ action });
  
  const response = await fetch(`${FUNCTION_URL}?${searchParams.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

// API Functions
export const searchRecipesByName = async (query: string): Promise<ApiRecipe[]> => {
  try {
    return await callRecipeApi<ApiRecipe[]>('search', { q: query });
  } catch (error) {
    console.error("Error searching recipes:", error);
    return [];
  }
};

export const searchRecipesByIngredient = async (ingredient: string): Promise<ApiRecipe[]> => {
  try {
    return await callRecipeApi<ApiRecipe[]>('search', { q: ingredient, byIngredient: 'true' });
  } catch (error) {
    console.error("Error searching by ingredient:", error);
    return [];
  }
};

export const getRecipeById = async (id: string): Promise<ApiRecipe | null> => {
  try {
    return await callRecipeApi<ApiRecipe | null>('getById', { id });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }
};

export const getRecipesByCategory = async (category: string): Promise<ApiRecipe[]> => {
  try {
    return await callRecipeApi<ApiRecipe[]>('getByCategory', { category });
  } catch (error) {
    console.error("Error fetching category recipes:", error);
    return [];
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    return await callRecipeApi<string[]>('getCategories');
  } catch (error) {
    console.error("Error fetching categories:", error);
    return ["Beef", "Chicken", "Dessert", "Lamb", "Pasta", "Pork", "Seafood", "Vegetarian"];
  }
};

export const getRandomRecipe = async (): Promise<ApiRecipe | null> => {
  try {
    return await callRecipeApi<ApiRecipe | null>('getRandom');
  } catch (error) {
    console.error("Error fetching random recipe:", error);
    return null;
  }
};

export const getFeaturedRecipes = async (count: number = 6): Promise<ApiRecipe[]> => {
  try {
    return await callRecipeApi<ApiRecipe[]>('getFeatured', { count: count.toString() });
  } catch (error) {
    console.error("Error fetching featured recipes:", error);
    return [];
  }
};

export const getLatestRecipes = async (): Promise<ApiRecipe[]> => {
  try {
    return await callRecipeApi<ApiRecipe[]>('getLatest');
  } catch (error) {
    console.error("Error fetching latest recipes:", error);
    return [];
  }
};

// Server-side serving calculator
export const scaleServings = async (
  ingredients: ApiIngredient[],
  originalServings: number,
  newServings: number
): Promise<ApiIngredient[]> => {
  try {
    return await callRecipeApiPost<ApiIngredient[]>('scaleServings', {
      ingredients,
      originalServings,
      newServings,
    });
  } catch (error) {
    console.error("Error scaling servings:", error);
    // Fallback to client-side calculation
    const ratio = newServings / originalServings;
    return ingredients.map(ing => ({
      ...ing,
      quantity: Math.round((ing.quantity * ratio) * 100) / 100,
      original: `${Math.round((ing.quantity * ratio) * 100) / 100} ${ing.unit} ${ing.name}`
    }));
  }
};
