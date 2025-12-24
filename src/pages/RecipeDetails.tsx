import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, ChefHat, Users, ShoppingCart, Globe } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServingCalculator from "@/components/ServingCalculator";
import IngredientItem from "@/components/IngredientItem";
import VideoTutorial from "@/components/VideoTutorial";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecipe } from "@/hooks/useRecipes";
import { useToast } from "@/hooks/use-toast";

const RecipeDetailsSkeleton = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      <div className="container py-4">
        <Skeleton className="h-6 w-32" />
      </div>
      <section className="container pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-[4/3] rounded-lg" />
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

const RecipeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: recipe, isLoading, error } = useRecipe(id);

  const [servings, setServings] = useState<number | null>(null);
  const [availableIngredients, setAvailableIngredients] = useState<Set<string>>(
    new Set()
  );

  // Set initial servings when recipe loads
  const currentServings = servings ?? recipe?.servings ?? 4;
  const multiplier = recipe ? currentServings / recipe.servings : 1;

  const missingIngredients = useMemo(() => {
    if (!recipe) return [];
    return recipe.ingredients.filter(
      (ing) => !availableIngredients.has(ing.id)
    );
  }, [recipe, availableIngredients]);

  const handleToggleAvailable = (id: string) => {
    setAvailableIngredients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAddToShoppingList = () => {
    if (!recipe) return;
    
    const existingItems = JSON.parse(
      localStorage.getItem("shoppingList") || "[]"
    );
    
    const newItems = missingIngredients.map((ing) => ({
      id: `${recipe.id}-${ing.id}`,
      name: ing.name,
      quantity: (ing.quantity * multiplier).toFixed(
        (ing.quantity * multiplier) % 1 === 0 ? 0 : 1
      ),
      unit: ing.unit,
      recipeName: recipe.name,
    }));

    const merged = [...existingItems];
    newItems.forEach((item) => {
      if (!merged.find((i: { id: string }) => i.id === item.id)) {
        merged.push(item);
      }
    });

    localStorage.setItem("shoppingList", JSON.stringify(merged));
    
    toast({
      title: "Added to Shopping List",
      description: `${missingIngredients.length} missing ingredient(s) added`,
    });

    navigate("/shopping");
  };

  if (isLoading) {
    return <RecipeDetailsSkeleton />;
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <EmptyState
            type="error"
            title="Recipe Not Found"
            description="We couldn't find the recipe you're looking for"
            actionLabel="Browse Recipes"
            actionHref="/recipes"
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Back Navigation */}
        <div className="container py-4">
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Recipes
          </Link>
        </div>

        {/* Hero */}
        <section className="container pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-elegant">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="tag-success font-display">{recipe.category}</Badge>
                {recipe.area && (
                  <Badge variant="outline" className="gap-1 font-display">
                    <Globe className="h-3 w-3" />
                    {recipe.area}
                  </Badge>
                )}
                <Badge
                  className={`font-display ${
                    recipe.difficulty === "Easy"
                      ? "tag-success"
                      : recipe.difficulty === "Medium"
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "tag-destructive"
                  }`}
                >
                  {recipe.difficulty}
                </Badge>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {recipe.name}
              </h1>
              <p className="text-muted-foreground font-body mb-6">{recipe.description}</p>
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-body">
                    {recipe.cookingTime} minutes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-body">{currentServings} servings</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-body">{recipe.difficulty}</span>
                </div>
              </div>
              <ServingCalculator
                servings={currentServings}
                defaultServings={recipe.servings}
                onServingsChange={setServings}
              />
            </div>
          </div>
        </section>

        <Separator />

        {/* Content Grid */}
        <section className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ingredients */}
            <div className="lg:col-span-1">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between font-display">
                    <span>Ingredients</span>
                    <span className="text-sm font-normal text-muted-foreground font-body">
                      {availableIngredients.size}/{recipe.ingredients.length} available
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recipe.ingredients.map((ingredient) => (
                    <IngredientItem
                      key={ingredient.id}
                      ingredient={ingredient}
                      multiplier={multiplier}
                      isAvailable={availableIngredients.has(ingredient.id)}
                      onToggleAvailable={handleToggleAvailable}
                    />
                  ))}
                  {missingIngredients.length > 0 && (
                    <Button
                      className="w-full mt-4 gap-2 btn-glow font-display"
                      onClick={handleAddToShoppingList}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add {missingIngredients.length} Missing to Cart
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-display">Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-semibold">
                          {index + 1}
                        </span>
                        <p className="text-foreground font-body pt-1">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Video Tutorial */}
              {recipe.videoUrl && (
                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <VideoTutorial
                      videoUrl={recipe.videoUrl}
                      title={recipe.name}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RecipeDetails;