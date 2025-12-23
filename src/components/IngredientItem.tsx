import { Check, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Ingredient } from "@/data/recipes";

interface IngredientItemProps {
  ingredient: Ingredient;
  multiplier: number;
  isAvailable: boolean;
  onToggleAvailable: (id: string) => void;
}

const IngredientItem = ({
  ingredient,
  multiplier,
  isAvailable,
  onToggleAvailable,
}: IngredientItemProps) => {
  const adjustedQuantity = (ingredient.quantity * multiplier).toFixed(
    ingredient.quantity * multiplier % 1 === 0 ? 0 : 1
  );

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
        isAvailable
          ? "bg-chart-1/10 border border-chart-1/30"
          : "bg-destructive/10 border border-destructive/30"
      }`}
    >
      <div className="flex items-center gap-3">
        <Checkbox
          id={ingredient.id}
          checked={isAvailable}
          onCheckedChange={() => onToggleAvailable(ingredient.id)}
        />
        <label
          htmlFor={ingredient.id}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="font-medium text-foreground">
            {adjustedQuantity} {ingredient.unit}
          </span>
          <span className="text-muted-foreground">{ingredient.name}</span>
        </label>
      </div>
      <div className="flex items-center gap-2">
        {isAvailable ? (
          <span className="flex items-center gap-1 text-sm text-chart-4">
            <Check className="h-4 w-4" />
            Available
          </span>
        ) : (
          <span className="flex items-center gap-1 text-sm text-destructive">
            <X className="h-4 w-4" />
            Missing
          </span>
        )}
      </div>
    </div>
  );
};

export default IngredientItem;
