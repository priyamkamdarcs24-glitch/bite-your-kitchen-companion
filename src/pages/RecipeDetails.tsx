import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, ChefHat, Users, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServingCalculator from "@/components/ServingCalculator";
import IngredientItem from "@/components/IngredientItem";
import VideoTutorial from "@/components/VideoTutorial";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { recipes } from "@/data/recipes";
import { useToast } from "@/hooks/use-toast";

const RecipeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const recipe = recipes.find((r) => r.id === id);

  const [servings, setServings] = useState(recipe?.servings || 4);
  const [availableIngredients, setAvailableIngredients] = useState<Set<string>>(
    new Set()
  );

  const multiplier = recipe ? servings / recipe.servings : 1;

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
    // Store missing ingredients in localStorage for shopping page
    const existingItems = JSON.parse(
      localStorage.getItem("shoppingList") || "[]"
    );
    
    const newItems = missingIngredients.map((ing) => ({
      id: `${recipe?.id}-${ing.id}`,
      name: ing.name,
      quantity: (ing.quantity * multiplier).toFixed(
        (ing.quantity * multiplier) % 1 === 0 ? 0 : 1
      ),
      unit: ing.unit,
      recipeName: recipe?.name,
    }));

    // Merge without duplicates
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

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Recipe Not Found
            </h1>
            <Link to="/recipes">
              <Button>Browse Recipes</Button>
            </Link>
          </div>
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
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Recipes
          </Link>
        </div>

        {/* Hero */}
        <section className="container pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{recipe.category}</Badge>
                <Badge
                  variant="outline"
                  className={
                    recipe.difficulty === "Easy"
                      ? "bg-chart-1/20 text-chart-4 border-chart-1"
                      : recipe.difficulty === "Medium"
                      ? "bg-primary/20 text-primary border-primary"
                      : "bg-destructive/20 text-destructive border-destructive"
                  }
                >
                  {recipe.difficulty}
                </Badge>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {recipe.name}
              </h1>
              <p className="text-muted-foreground mb-6">{recipe.description}</p>
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-foreground">
                    {recipe.cookingTime} minutes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-foreground">{servings} servings</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-primary" />
                  <span className="text-foreground">{recipe.difficulty}</span>
                </div>
              </div>
              <ServingCalculator
                servings={servings}
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Ingredients</span>
                    <span className="text-sm font-normal text-muted-foreground">
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
                      className="w-full mt-4 gap-2"
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
              <Card>
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                          {index + 1}
                        </span>
                        <p className="text-foreground pt-1">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Video Tutorial */}
              {recipe.videoUrl && (
                <Card>
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
