import { Search, ChefHat, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: "no-results" | "error" | "empty";
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
}

const icons = {
  "no-results": Search,
  error: AlertCircle,
  empty: ChefHat,
};

const defaultContent = {
  "no-results": {
    title: "No recipes found",
    description: "Try adjusting your search or browse different categories",
  },
  error: {
    title: "Something went wrong",
    description: "We couldn't load the recipes. Please try again.",
  },
  empty: {
    title: "No recipes yet",
    description: "Start exploring our collection of delicious recipes",
  },
};

const EmptyState = ({
  type,
  title,
  description,
  onAction,
  actionLabel = "Try Again",
}: EmptyStateProps) => {
  const Icon = icons[type];
  const content = defaultContent[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
        {title || content.title}
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {description || content.description}
      </p>
      {onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;