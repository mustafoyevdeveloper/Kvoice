import { useState } from "react";
import { Search, Menu, X, Home, Film, Tv, Star, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  onSearch: (query: string) => void;
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

export const Header = ({ onSearch, onCategorySelect, selectedCategory }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { id: "all", label: "Barchasi", icon: Home, path: "/" },
    { id: "premieres", label: "Premyeralar", icon: Star, path: "/premieres" },
    { id: "movies", label: "Kinolar", icon: Film, path: "/movies" },
    { id: "series", label: "Seriallar", icon: Tv, path: "/series" },
    { id: "new", label: "Yangi", icon: Calendar, path: "/new" },
    { id: "admin", label: "Admin", icon: Settings, path: "/admin" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-md border-b border-primary/20 mobile-nav">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary-foreground hover:bg-primary-glow/20 touch-feedback btn-interactive"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="text-lg md:text-xl font-bold text-primary-foreground animate-fade-in">
              MovieMedia
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={location.pathname === category.path ? "secondary" : "ghost"}
                  size="sm"
                  className={`text-primary-foreground hover:bg-primary-glow/20 btn-interactive animate-slide-in-left ${
                    location.pathname === category.path 
                      ? "bg-secondary text-secondary-foreground" 
                      : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(category.path)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Qidiruv..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48 md:w-64 bg-input/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              />
            </div>
          </form>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="py-4 border-t border-primary/20">
            <div className="flex flex-col space-y-2">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={location.pathname === category.path ? "secondary" : "ghost"}
                    size="sm"
                    className={`justify-start text-primary-foreground hover:bg-primary-glow/20 touch-feedback btn-interactive animate-slide-in-left ${
                      location.pathname === category.path 
                        ? "bg-secondary text-secondary-foreground" 
                        : ""
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => {
                      navigate(category.path);
                      setIsMenuOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};