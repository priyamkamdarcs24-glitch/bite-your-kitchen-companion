import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  size?: "default" | "large";
}

const SearchBar = ({
  onSearch,
  placeholder = "Search recipes or ingredients...",
  className = "",
  size = "default",
}: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search className={`absolute left-4 text-muted-foreground ${size === "large" ? "h-5 w-5" : "h-4 w-4"}`} />
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder={placeholder}
          className={`pl-11 pr-24 ${
            size === "large"
              ? "h-14 text-lg rounded-full"
              : "h-10 rounded-lg"
          } bg-card border-border focus-visible:ring-primary`}
        />
        <Button
          type="submit"
          className={`absolute right-1 ${
            size === "large" ? "h-12 px-6 rounded-full" : "h-8 px-4 rounded-md"
          }`}
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
