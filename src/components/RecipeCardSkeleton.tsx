import { Card, CardContent } from "@/components/ui/card";

const RecipeCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] skeleton-shimmer" />
      <CardContent className="p-4 space-y-3">
        <div className="h-6 w-3/4 skeleton-shimmer rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full skeleton-shimmer rounded" />
          <div className="h-4 w-2/3 skeleton-shimmer rounded" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-4">
            <div className="h-4 w-16 skeleton-shimmer rounded" />
            <div className="h-4 w-16 skeleton-shimmer rounded" />
          </div>
          <div className="h-9 w-24 skeleton-shimmer rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
};

export const RecipeGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default RecipeCardSkeleton;