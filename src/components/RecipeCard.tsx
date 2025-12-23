import { Link } from "react-router-dom";
import { Clock, ChefHat, Heart, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ApiRecipe } from "@/lib/api/recipeApi";
import { useState } from "react";

interface RecipeCardProps {
  recipe: ApiRecipe;
}

const difficultyStyles = {
  Easy: "tag-success",
  Medium: "bg-primary/10 text-primary border border-primary/20",
  Hard: "tag-destructive",
};

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="group overflow-hidden card-hover border-border/50">
      {/* Image Container */}
      <div className="relative aspect-[4/3] img-zoom">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <Badge className="tag-success font-display">
            {recipe.category}
          </Badge>
          
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-background hover:scale-110"
          >
            <Heart
              className={`h-5 w-5 transition-colors duration-300 ${
                isFavorite
                  ? "fill-destructive text-destructive"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        </div>

        {/* Difficulty Badge */}
        <Badge
          className={`absolute bottom-3 right-3 ${difficultyStyles[recipe.difficulty]} font-display`}
        >
          {recipe.difficulty}
        </Badge>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
          {recipe.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {recipe.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              {recipe.cookingTime}m
            </span>
            <span className="flex items-center gap-1">
              <ChefHat className="h-4 w-4 text-secondary" />
              {recipe.servings}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-destructive" />
              {recipe.ingredients.length}
            </span>
          </div>
          <Link to={`/recipe/${recipe.id}`}>
            <Button size="sm" className="btn-glow font-display">
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;