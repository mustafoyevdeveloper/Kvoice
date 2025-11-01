import { useState, useEffect, useMemo } from "react";
import { Search, Home, Film, Tv, Star, Calendar, Settings, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import useSettingsStore from "@/store/settings";

interface HeaderProps {
  onSearch: (query: string) => void;
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
  isHomePage?: boolean;
}

export const Header = ({ onSearch, onCategorySelect, selectedCategory, isHomePage = false }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { settings } = useSettingsStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Site settings are now loaded from backend, no localStorage needed

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

  // Categories array - settings loaded bo'lgandan keyin ishlatiladi
  const categories = useMemo(() => [
    { id: "all", label: "Barchasi", icon: Home, path: "/" },
    { id: "series", label: settings?.sectionNames?.series || "Seriallar", icon: Tv, path: "/series" },
    { id: "movies", label: settings?.sectionNames?.movies || "Kinolar", icon: Film, path: "/movies" },
  ], [settings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ease-in-out mobile-nav ${
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
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Site Logo */}
              <div className={`flex items-center justify-center h-8 w-8 md:h-10 md:w-10 rounded-full border transition-all duration-300 ease-in-out ${
                isScrolled ? 'bg-primary/20 border-primary/30' : 'bg-primary/0 border-primary/5'
              }`}>
                <img 
                  src="/favicon.png" 
                  alt="Kvoice Logo" 
                  className="h-6 w-6 md:h-7 md:w-7 object-contain"
                  onError={(e) => {
                    // Agar logo yuklanmasa, fallback icon ko'rsatish
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-primary font-bold text-sm md:text-base">K</span>';
                    }
                  }}
                />
              </div>
              <div className={`text-lg md:text-xl font-bold animate-fade-in transition-all duration-300 ease-in-out ${
                isScrolled ? 'text-primary-foreground' : isHomePage ? 'text-white' : 'text-primary'
              }`}>
                {settings?.siteName || "Kvoice"}
              </div>
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
                  className={`hover:bg-primary-glow/20 btn-interactive animate-slide-in-left transition-all duration-300 ease-in-out ${
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
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-all duration-300 ease-in-out z-10 pointer-events-none ${
                isHomePage && !isScrolled ? 'text-white drop-shadow-lg' : 'text-muted-foreground'
              }`} style={{ zIndex: 10 }} />
              <Input
                type="text"
                placeholder="Qidiruv..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-12 w-48 md:w-64 border-border/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-all duration-300 ease-in-out ${
                  isHomePage && !isScrolled 
                    ? 'bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70' 
                    : 'bg-input/50'
                }`}
              />
              <Button
                type="submit"
                size="sm"
                className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 rounded-md bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 ${
                  isHomePage && !isScrolled 
                    ? 'text-white hover:text-white shadow-lg' 
                    : 'text-primary hover:text-primary-foreground'
                }`}
              >
                <Search className="h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
        </div>

        {/* Mobile Navigation - Horizontal Category Bar */}
        <div className="md:hidden relative z-50">
          <nav className={`py-2 border-t transition-all duration-300 ease-in-out ${
            isScrolled ? 'border-primary/30 bg-primary/95 backdrop-blur-md' : 'border-primary/20 bg-background/95 backdrop-blur-md'
          }`}>
            <div className="flex items-center justify-between w-full">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={location.pathname === category.path ? "secondary" : "ghost"}
                    size="sm"
                    className={`flex-1 hover:bg-primary-glow/20 touch-feedback btn-interactive transition-all duration-300 ease-in-out whitespace-nowrap ${
                      index < categories.length - 1 ? 'mr-1' : ''
                    } ${
                      location.pathname === category.path 
                        ? "bg-secondary text-secondary-foreground" 
                        : isScrolled ? "text-primary-foreground" : isHomePage ? "text-white" : "text-foreground"
                    }`}
                    onClick={() => {
                      navigate(category.path);
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
    </>
  );
};