import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import RecipeCard from "@/components/RecipeCard";
import RecipeCardSkeleton from "@/components/RecipeCardSkeleton";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useSearchRecipes, useRecipesByCategory, useCategories, useLatestRecipes } from "@/hooks/useRecipes";

const Recipes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data based on search/category
  const { data: searchResults, isLoading: searchLoading } = useSearchRecipes(debouncedQuery);
  const { data: categoryResults, isLoading: categoryLoading } = useRecipesByCategory(selectedCategory);
  const { data: latestRecipes, isLoading: latestLoading } = useLatestRecipes();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Determine which recipes to show
  const isLoading = debouncedQuery ? searchLoading : selectedCategory !== "All" ? categoryLoading : latestLoading;
  const recipes = debouncedQuery ? searchResults : selectedCategory !== "All" ? categoryResults : latestRecipes;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setDebouncedQuery("");
    const params = new URLSearchParams();
    if (category !== "All") {
      params.set("category", category);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setSelectedCategory("All");
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Search Header */}
        <section className="bg-gradient-warm py-12">
          <div className="container">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Find Your Perfect Recipe
            </h1>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by recipe name or ingredients..."
              className="max-w-2xl"
            />
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-border py-4 bg-card">
          <div className="container">
            <div className="flex flex-wrap gap-2">
              {categoriesLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-9 w-20 rounded-full bg-muted animate-pulse" />
                ))
              ) : (
                <>
                  <Button
                    variant={selectedCategory === "All" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryChange("All")}
                    className="rounded-full font-display"
                  >
                    All
                  </Button>
                  {categories?.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryChange(category)}
                      className="rounded-full font-display"
                    >
                      {category}
                    </Button>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-8 md:py-12">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground font-body">
                {isLoading ? (
                  "Loading recipes..."
                ) : (
                  <>
                    {recipes?.length || 0} recipe{(recipes?.length || 0) !== 1 ? "s" : ""} found
                    {debouncedQuery && <span> for "{debouncedQuery}"</span>}
                    {selectedCategory !== "All" && !debouncedQuery && (
                      <span> in {selectedCategory}</span>
                    )}
                  </>
                )}
              </p>
              {(debouncedQuery || selectedCategory !== "All") && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="font-display">
                  Clear Filters
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))}
              </div>
            ) : recipes && recipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <EmptyState
                type="no-results"
                title="No recipes found"
                description={
                  debouncedQuery
                    ? `We couldn't find any recipes matching "${debouncedQuery}"`
                    : "Try searching for something else or browse a different category"
                }
                actionLabel="Clear Filters"
                onAction={clearFilters}
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Recipes;