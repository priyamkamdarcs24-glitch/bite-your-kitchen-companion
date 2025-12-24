// React Query hooks for recipe API (using backend edge function)

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
  scaleServings,
  type ApiRecipe,
  type ApiIngredient,
} from "@/lib/api/recipeApiBackend";

export type { ApiRecipe, ApiIngredient };

export const useSearchRecipes = (query: string, searchByIngredient: boolean = false) => {
  return useQuery({
    queryKey: ["recipes", "search", query, searchByIngredient],
    queryFn: () => 
      searchByIngredient 
        ? searchRecipesByIngredient(query) 
        : searchRecipesByName(query),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRecipe = (id: string | undefined) => {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getRecipeById(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRecipesByCategory = (category: string) => {
  return useQuery({
    queryKey: ["recipes", "category", category],
    queryFn: () => getRecipesByCategory(category),
    enabled: category.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useRandomRecipe = () => {
  return useQuery({
    queryKey: ["recipe", "random"],
    queryFn: getRandomRecipe,
    staleTime: 0, // Always refetch for randomness
  });
};

export const useFeaturedRecipes = (count: number = 6) => {
  return useQuery({
    queryKey: ["recipes", "featured", count],
    queryFn: () => getFeaturedRecipes(count),
    staleTime: 5 * 60 * 1000,
  });
};

export const useLatestRecipes = () => {
  return useQuery({
    queryKey: ["recipes", "latest"],
    queryFn: getLatestRecipes,
    staleTime: 5 * 60 * 1000,
  });
};

export const useScaleServings = () => {
  return {
    scale: scaleServings,
  };
};

// Infinite scroll for recipes
export const useInfiniteRecipes = (category: string, searchQuery: string) => {
  return useInfiniteQuery({
    queryKey: ["recipes", "infinite", category, searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      let recipes: ApiRecipe[];
      
      if (searchQuery) {
        recipes = await searchRecipesByName(searchQuery);
      } else if (category) {
        recipes = await getRecipesByCategory(category);
      } else {
        recipes = await getLatestRecipes();
      }
      
      // Simulate pagination (API returns all at once, we paginate client-side)
      const pageSize = 12;
      const start = pageParam * pageSize;
      const paginatedRecipes = recipes.slice(start, start + pageSize);
      
      return {
        recipes: paginatedRecipes,
        nextPage: start + pageSize < recipes.length ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });
};
