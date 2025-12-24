import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChefHat, Clock, ShoppingBag, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import RecipeCard from "@/components/RecipeCard";
import RecipeCardSkeleton from "@/components/RecipeCardSkeleton";
import FeaturedRecipe from "@/components/FeaturedRecipe";
import EmptyState from "@/components/EmptyState";
import { useFeaturedRecipes, useRandomRecipe, useCategories } from "@/hooks/useRecipes";
import heroImage from "@/assets/hero-kitchen.jpg";

const Index = () => {
  const navigate = useNavigate();
  
  const { data: featuredRecipes, isLoading: featuredLoading, error: featuredError } = useFeaturedRecipes(3);
  const { data: featuredOfDay, isLoading: featuredOfDayLoading } = useRandomRecipe();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(query)}`);
    }
  };

  const features = [
    {
      icon: Utensils,
      title: "Search by Ingredients",
      description: "Find recipes using ingredients you already have at home",
    },
    {
      icon: Clock,
      title: "Adjust Servings",
      description: "Dynamically scale ingredient quantities for any serving size",
    },
    {
      icon: ChefHat,
      title: "Step-by-Step Guides",
      description: "Follow easy instructions with video tutorials",
    },
    {
      icon: ShoppingBag,
      title: "Quick Shopping",
      description: "Order missing ingredients directly through delivery apps",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Fresh ingredients on kitchen counter"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
        <div className="relative container h-full flex flex-col justify-center">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-background mb-4">
              What's Cooking
              <br />
              <span className="text-primary">Today?</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-background/90 mb-8 max-w-lg">
              Discover delicious recipes, adjust servings instantly, and order
              missing ingredients with just a few clicks.
            </p>
            <div className="mb-6">
              <SearchBar
                onSearch={handleSearch}
                size="large"
                placeholder="Search recipes or ingredients..."
                className="max-w-xl"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/recipes">
                <Button size="lg" className="gap-2 btn-glow font-display">
                  Explore Recipes
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/recipes">
                <Button size="lg" variant="outline" className="bg-background/10 border-background text-background hover:bg-background/20 font-display">
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipe of the Day */}
      {(featuredOfDayLoading || featuredOfDay) && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Recipe of the Day
              </h2>
              <p className="text-muted-foreground font-body">
                Today's handpicked recommendation just for you
              </p>
            </div>
            {featuredOfDayLoading ? (
              <div className="max-w-4xl mx-auto h-[400px] rounded-2xl bg-muted animate-pulse" />
            ) : featuredOfDay ? (
              <FeaturedRecipe recipe={featuredOfDay} />
            ) : null}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose BITE?
            </h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              Everything you need to cook amazing meals with confidence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-border hover:border-primary/50 transition-all duration-300 card-hover">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Featured Recipes
              </h2>
              <p className="text-muted-foreground font-body">
                Handpicked favorites to get you started
              </p>
            </div>
            <Link to="/recipes">
              <Button variant="ghost" className="gap-2 font-display">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {featuredError ? (
            <EmptyState
              type="error"
              title="Failed to load recipes"
              description="Please try refreshing the page"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <RecipeCardSkeleton key={i} />
                  ))
                : featuredRecipes?.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground font-body">
              Find recipes that match your craving
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categoriesLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-10 w-24 rounded-full bg-muted animate-pulse" />
                ))
              : categories?.map((category) => (
                  <Link key={category} to={`/recipes?category=${category}`}>
                    <Button variant="outline" size="lg" className="rounded-full font-display hover:bg-primary hover:text-primary-foreground transition-colors">
                      {category}
                    </Button>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-warm">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Cooking?
          </h2>
          <p className="text-primary-foreground/80 font-body max-w-2xl mx-auto mb-8">
            Explore our collection of delicious recipes and turn your ingredients
            into amazing meals today.
          </p>
          <Link to="/recipes">
            <Button size="lg" variant="secondary" className="gap-2 font-display btn-glow">
              Browse All Recipes
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;