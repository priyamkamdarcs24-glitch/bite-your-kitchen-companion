import { Link } from "react-router-dom";
import { Clock, ChefHat, ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ApiRecipe } from "@/lib/api/recipeApi";

interface FeaturedRecipeProps {
  recipe: ApiRecipe;
}

const FeaturedRecipe = ({ recipe }: FeaturedRecipeProps) => {
  return (
    <div className="relative rounded-2xl overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/30" />
      </div>

      {/* Content */}
      <div className="relative p-8 md:p-12 min-h-[400px] md:min-h-[450px] flex flex-col justify-end">
        {/* Featured Badge */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8">
          <Badge className="bg-primary text-primary-foreground px-4 py-1.5 text-sm font-display font-semibold animate-pulse-soft">
            ✨ Recipe of the Day
          </Badge>
        </div>

        {/* Recipe Info */}
        <div className="max-w-xl">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-secondary/20 text-secondary border-secondary/30 backdrop-blur-sm">
              {recipe.category}
            </Badge>
            <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30 backdrop-blur-sm">
              {recipe.area}
            </Badge>
          </div>

          {/* Title */}
          <h2 className="font-display text-3xl md:text-5xl font-bold text-background mb-4 leading-tight">
            {recipe.name}
          </h2>

          {/* Description */}
          <p className="text-background/80 text-lg mb-6 line-clamp-2">
            {recipe.description}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2 text-background/90">
              <Clock className="h-5 w-5 text-primary" />
              <span>{recipe.cookingTime} min</span>
            </div>
            <div className="flex items-center gap-2 text-background/90">
              <ChefHat className="h-5 w-5 text-primary" />
              <span>{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-2 text-background/90">
              <Flame className="h-5 w-5 text-primary" />
              <span>{recipe.ingredients.length} ingredients</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link to={`/recipe/${recipe.id}`}>
            <Button size="lg" className="btn-glow gap-2 font-display font-semibold px-8">
              Cook Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const FeaturedRecipeSkeleton = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-muted min-h-[400px] md:min-h-[450px]">
      <div className="absolute inset-0 skeleton-shimmer" />
      <div className="relative p-8 md:p-12 flex flex-col justify-end h-full">
        <div className="max-w-xl space-y-4">
          <div className="h-6 w-32 skeleton-shimmer rounded-full" />
          <div className="h-12 w-3/4 skeleton-shimmer rounded" />
          <div className="h-6 w-full skeleton-shimmer rounded" />
          <div className="flex gap-6">
            <div className="h-5 w-20 skeleton-shimmer rounded" />
            <div className="h-5 w-20 skeleton-shimmer rounded" />
          </div>
          <div className="h-12 w-40 skeleton-shimmer rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default FeaturedRecipe;