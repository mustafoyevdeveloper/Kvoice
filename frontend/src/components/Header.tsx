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
  const isAdmin = location.pathname.startsWith('/admin');

  // Site settings

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
              <div className={`flex items-center justify-center h-12 w-12 md:h-[3.75rem] md:w-[3.75rem] rounded-full border transition-all duration-300 ease-in-out ${
                isScrolled ? 'bg-primary/20 border-primary/30' : 'bg-primary/0 border-primary/5'
              }`}>
                <img 
                  src="/favicon.png" 
                  alt="Kvoice Logo" 
                  className="h-9 w-9 md:h-[2.625rem] md:w-[2.625rem] object-contain"
                  onError={(e) => {
                    // Agar logo yuklanmasa, fallback icon ko'rsatish
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-primary font-bold text-base md:text-lg">K</span>';
                    }
                  }}
                />
              </div>
              <div className={`text-xl md:text-3xl font-bold animate-fade-in transition-all duration-300 ease-in-out ${
                isScrolled ? 'text-white' : 'text-primary'
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

          {/* Search - hidden on admin pages */}
          {!isAdmin && (
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-all duration-300 ease-in-out z-10 pointer-events-none text-white-foreground" style={{ zIndex: 10 }} />
                <Input
                  type="text"
                  placeholder="Kino yoki serial nomini kiriting..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    // Real-time qidiruv - har bir harf kirilganda qidirish
                    onSearch(e.target.value);
                  }}
                  className={`pl-10 pr-4 max-w-[200px] md:max-w-none w-78 md:w-64 text-foreground placeholder:text-white-foreground focus:ring-2 focus:ring-primary/100 transition-all duration-300 ease-in-out border-white/100 ${
                    isHomePage && !isScrolled 
                      ? 'bg-white/10 backdrop-blur-sm text-white placeholder:text-white/100' 
                      : 'bg-input/50'
                  }`}
                />
              </div>
            </form>
          )}
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