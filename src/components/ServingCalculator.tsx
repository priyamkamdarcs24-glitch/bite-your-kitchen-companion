import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ServingCalculatorProps {
  servings: number;
  defaultServings: number;
  onServingsChange: (servings: number) => void;
}

const ServingCalculator = ({
  servings,
  defaultServings,
  onServingsChange,
}: ServingCalculatorProps) => {
  const handleDecrease = () => {
    if (servings > 1) {
      onServingsChange(servings - 1);
    }
  };

  const handleIncrease = () => {
    if (servings < 20) {
      onServingsChange(servings + 1);
    }
  };

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium text-foreground">Servings</span>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleDecrease}
            disabled={servings <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-xl font-bold text-primary w-8 text-center">
            {servings}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleIncrease}
            disabled={servings >= 20}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Slider
        value={[servings]}
        onValueChange={([value]) => onServingsChange(value)}
        min={1}
        max={20}
        step={1}
        className="w-full"
      />
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Original recipe: {defaultServings} servings
      </p>
    </div>
  );
};

export default ServingCalculator;
