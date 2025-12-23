import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  searchRecipesByName,
  searchRecipesByIngredient,
  getRecipeById,
  getRecipesByCategory,
  getCategories,
  getRandomRecipe,
  getFeaturedRecipes,
  getLatestRecipes,
  type ApiRecipe,
} from "@/lib/api/recipeApi";

// Search recipes by name or ingredient
export const useSearchRecipes = (query: string, searchByIngredient: boolean = false) => {
  return useQuery({
    queryKey: ["recipes", "search", query, searchByIngredient],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      if (searchByIngredient) {
        return searchRecipesByIngredient(query);
      }
      return searchRecipesByName(query);
    },
    enabled: query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single recipe by ID
export const useRecipe = (id: string | undefined) => {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: () => (id ? getRecipeById(id) : null),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get recipes by category
export const useRecipesByCategory = (category: string) => {
  return useQuery({
    queryKey: ["recipes", "category", category],
    queryFn: () => getRecipesByCategory(category),
    enabled: category !== "All" && category.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

// Get all categories
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get random recipe
export const useRandomRecipe = () => {
  return useQuery({
    queryKey: ["recipe", "random"],
    queryFn: getRandomRecipe,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });
};

// Get featured recipes
export const useFeaturedRecipes = (count: number = 6) => {
  return useQuery({
    queryKey: ["recipes", "featured", count],
    queryFn: () => getFeaturedRecipes(count),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Get latest recipes
export const useLatestRecipes = () => {
  return useQuery({
    queryKey: ["recipes", "latest"],
    queryFn: getLatestRecipes,
    staleTime: 5 * 60 * 1000,
  });
};

// Infinite scroll for browsing recipes
export const useInfiniteRecipes = (category: string, searchQuery: string) => {
  return useInfiniteQuery({
    queryKey: ["recipes", "infinite", category, searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      let recipes: ApiRecipe[] = [];
      
      if (searchQuery.trim()) {
        recipes = await searchRecipesByName(searchQuery);
      } else if (category && category !== "All") {
        recipes = await getRecipesByCategory(category);
      } else {
        recipes = await getLatestRecipes();
      }
      
      // Simulate pagination
      const pageSize = 12;
      const start = pageParam * pageSize;
      const paginatedRecipes = recipes.slice(start, start + pageSize);
      
      return {
        recipes: paginatedRecipes,
        nextPage: paginatedRecipes.length === pageSize ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });
};