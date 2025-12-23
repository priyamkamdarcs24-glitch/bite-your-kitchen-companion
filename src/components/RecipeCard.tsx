import { Link } from "react-router-dom";
import { Clock, ChefHat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/data/recipes";

interface RecipeCardProps {
  recipe: Recipe;
}

const difficultyColors = {
  Easy: "bg-chart-1/20 text-chart-4 border-chart-1",
  Medium: "bg-primary/20 text-primary border-primary",
  Hard: "bg-destructive/20 text-destructive border-destructive",
};

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        <Badge
          variant="outline"
          className={`absolute top-3 right-3 ${difficultyColors[recipe.difficulty]}`}
        >
          {recipe.difficulty}
        </Badge>
        <Badge
          variant="secondary"
          className="absolute top-3 left-3"
        >
          {recipe.category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1 mb-2">
          {recipe.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {recipe.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {recipe.cookingTime} min
            </span>
            <span className="flex items-center gap-1">
              <ChefHat className="h-4 w-4" />
              {recipe.servings} servings
            </span>
          </div>
          <Link to={`/recipe/${recipe.id}`}>
            <Button size="sm">View Recipe</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
