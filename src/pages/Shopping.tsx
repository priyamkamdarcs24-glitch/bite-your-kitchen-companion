import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, ExternalLink, ShoppingBag, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  recipeName: string;
}

const Shopping = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedItems = JSON.parse(
      localStorage.getItem("shoppingList") || "[]"
    );
    setItems(storedItems);
  }, []);

  const handleRemoveItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    localStorage.setItem("shoppingList", JSON.stringify(newItems));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your shopping list",
    });
  };

  const handleClearAll = () => {
    setItems([]);
    localStorage.setItem("shoppingList", JSON.stringify([]));
    toast({
      title: "List Cleared",
      description: "All items have been removed from your shopping list",
    });
  };

  const handleOrderOnBlinkit = () => {
    // Generate a search query from items
    const searchQuery = items.map((item) => item.name).join(", ");
    window.open(
      `https://blinkit.com/search?q=${encodeURIComponent(searchQuery)}`,
      "_blank"
    );
  };

  const handleOrderOnInstaMart = () => {
    window.open("https://www.swiggy.com/instamart", "_blank");
  };

  const handleOrderOnBigBasket = () => {
    const searchQuery = items[0]?.name || "groceries";
    window.open(
      `https://www.bigbasket.com/ps/?q=${encodeURIComponent(searchQuery)}`,
      "_blank"
    );
  };

  // Group items by recipe
  const groupedItems = items.reduce((acc, item) => {
    const recipe = item.recipeName || "Other";
    if (!acc[recipe]) {
      acc[recipe] = [];
    }
    acc[recipe].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-card border-b border-border py-8">
          <div className="container">
            <Link
              to="/recipes"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Recipes
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Shopping List
                </h1>
                <p className="text-muted-foreground">
                  {items.length} item{items.length !== 1 ? "s" : ""} to buy
                </p>
              </div>
              {items.length > 0 && (
                <Button variant="outline" onClick={handleClearAll}>
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="container py-8">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-6">
                {Object.entries(groupedItems).map(([recipeName, recipeItems]) => (
                  <Card key={recipeName}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>From: {recipeName}</span>
                        <Badge variant="secondary">{recipeItems.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {recipeItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-foreground">
                              {item.quantity} {item.unit}
                            </span>
                            <span className="text-muted-foreground">
                              {item.name}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Options */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      Order Now
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-4">
                      Get your ingredients delivered quickly from these services:
                    </p>
                    <Button
                      className="w-full gap-2"
                      onClick={handleOrderOnBlinkit}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Order on Blinkit
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={handleOrderOnInstaMart}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Order on InstaMart
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={handleOrderOnBigBasket}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Order on BigBasket
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Your Shopping List is Empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Browse recipes and add missing ingredients to your list
              </p>
              <Link to="/recipes">
                <Button>Browse Recipes</Button>
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Shopping;
