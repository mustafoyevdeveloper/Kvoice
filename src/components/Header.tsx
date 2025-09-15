import { useState, useEffect } from "react";
import { Search, Menu, X, Home, Film, Tv, Star, Calendar, Settings, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  onSearch: (query: string) => void;
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
  isHomePage?: boolean;
}

export const Header = ({ onSearch, onCategorySelect, selectedCategory, isHomePage = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) {
        // Home sahifasida 5px scroll qilganda background ko'rsatish
        setIsScrolled(window.scrollY > 5);
      } else {
        // Boshqa sahifalarda 5px scroll qilganda background ko'rsatish
        setIsScrolled(window.scrollY > 5);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const categories = [
    { id: "all", label: "Barchasi", icon: Home, path: "/" },
    { id: "premieres", label: "Premyeralar", icon: Star, path: "/premieres" },
    { id: "movies", label: "Kinolar", icon: Film, path: "/movies" },
    { id: "series", label: "Seriallar", icon: Tv, path: "/series" },
    { id: "trailers", label: "Treylerlar", icon: Play, path: "/trailers" },
    { id: "new", label: "Yangi", icon: Calendar, path: "/new" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 mobile-nav ${
      isScrolled 
        ? 'bg-primary/95 backdrop-blur-md border-b border-primary/20' 
        : isHomePage 
          ? 'bg-transparent' 
          : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden hover:bg-primary-glow/20 touch-feedback btn-interactive transition-colors duration-300 ${
                isScrolled ? 'text-primary-foreground' : isHomePage ? 'text-white' : 'text-primary'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className={`text-lg md:text-xl font-bold animate-fade-in transition-colors duration-300 ${
              isScrolled ? 'text-primary-foreground' : isHomePage ? 'text-white' : 'text-primary'
            }`}>
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
                  className={`hover:bg-primary-glow/20 btn-interactive animate-slide-in-left transition-colors duration-300 ${
                    location.pathname === category.path 
                      ? "bg-secondary text-secondary-foreground" 
                      : isScrolled ? "text-primary-foreground" : isHomePage ? "text-white" : "text-primary"
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
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300 z-10 pointer-events-none ${
                isHomePage && !isScrolled ? 'text-white drop-shadow-lg' : 'text-muted-foreground'
              }`} style={{ zIndex: 10 }} />
              <Input
                type="text"
                placeholder="Qidiruv..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 w-48 md:w-64 border-border/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${
                  isHomePage && !isScrolled 
                    ? 'bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70' 
                    : 'bg-input/50'
                }`}
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
                    className={`justify-start hover:bg-primary-glow/20 touch-feedback btn-interactive animate-slide-in-left transition-colors duration-300 ${
                      location.pathname === category.path 
                        ? "bg-secondary text-secondary-foreground" 
                        : isScrolled ? "text-primary-foreground" : isHomePage ? "text-white" : "text-primary"
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