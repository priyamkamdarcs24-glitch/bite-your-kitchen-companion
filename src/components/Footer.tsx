import { Link } from "react-router-dom";
import { ChefHat, Instagram, Twitter, Youtube, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-footer border-t border-border/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <ChefHat className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold text-foreground">
                BITE
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6 font-sans">
              Best Instructions, Tasty Execution. Your personal recipe assistant
              that helps you cook amazing meals with ingredients you already have.
            </p>
            <p className="font-display text-lg text-foreground mb-4">
              Cook smarter with BITE 🍽️
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors font-sans"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/recipes"
                  className="text-muted-foreground hover:text-primary transition-colors font-sans"
                >
                  Browse Recipes
                </Link>
              </li>
              <li>
                <Link
                  to="/shopping"
                  className="text-muted-foreground hover:text-primary transition-colors font-sans"
                >
                  Shopping List
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">
              Popular Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/recipes?category=Chicken"
                  className="text-muted-foreground hover:text-primary transition-colors font-sans"
                >
                  Chicken
                </Link>
              </li>
              <li>
                <Link
                  to="/recipes?category=Pasta"
                  className="text-muted-foreground hover:text-primary transition-colors font-sans"
                >
                  Pasta
                </Link>
              </li>
              <li>
                <Link
                  to="/recipes?category=Seafood"
                  className="text-muted-foreground hover:text-primary transition-colors font-sans"
                >
                  Seafood
                </Link>
              </li>
              <li>
                <Link
                  to="/recipes?category=Vegetarian"
                  className="text-muted-foreground hover:text-primary transition-colors font-sans"
                >
                  Vegetarian
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-sans">
            © {currentYear} BITE. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 font-sans">
            Made with{" "}
            <Heart className="h-4 w-4 text-destructive fill-destructive animate-pulse-soft" />{" "}
            for home cooks everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;