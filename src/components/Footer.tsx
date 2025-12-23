import { Link } from "react-router-dom";
import { ChefHat, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <ChefHat className="h-8 w-8 text-primary" />
              <span className="font-serif text-2xl font-bold text-foreground">
                BITE
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Best Instructions, Tasty Execution. Your personal recipe assistant
              that helps you cook amazing meals with ingredients you already have.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/recipes"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Browse Recipes
                </Link>
              </li>
              <li>
                <Link
                  to="/shopping"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Shopping List
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/recipes?category=Italian"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Italian
                </Link>
              </li>
              <li>
                <Link
                  to="/recipes?category=Indian"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Indian
                </Link>
              </li>
              <li>
                <Link
                  to="/recipes?category=Mexican"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Mexican
                </Link>
              </li>
              <li>
                <Link
                  to="/recipes?category=Breakfast"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Breakfast
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BITE. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-primary fill-primary" /> for home cooks
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
