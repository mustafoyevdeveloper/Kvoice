import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MovieGrid } from "@/components/MovieGrid";
import { useMovies } from "@/store/movies";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import useSettingsStore from "@/store/settings";

export const Movies = () => {
  const { movies } = useMovies();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("movies");
  const [siteSettings, setSiteSettings] = useState({
    sectionTitles: {
      movies: "KINOLAR"
    },
    sectionDescriptions: {
      movies: "Eng yaxshi kinolar to'plami"
    }
  });

  // Site settings are now loaded from backend
  const { settings } = useSettingsStore();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  // Filter movies for movies category
  const moviesList = movies.filter(movie => 
    movie.category === "movies" || movie.category === "movie"
  );

  // Filter by search query
  const filteredMovies = moviesList.filter(movie =>
    !searchQuery.trim() || 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleMovieClick = (movie: any) => {
    window.location.href = `/movie/${movie.id}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Search Results Header */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Orqaga qaytish</span>
              </Button>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Qidiruv natijasi: "{searchQuery}"
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredMovies.length} ta natija topildi
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Section Header */}
        {!searchQuery && (
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in">
              {siteSettings.sectionTitles.movies}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-fade-in-up">
              {siteSettings.sectionDescriptions.movies}
            </p>
          </div>
        )}

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <MovieGrid 
            movies={filteredMovies} 
            title=""
            onMovieClick={handleMovieClick}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "Qidiruv natijasi topilmadi" : "Hech qanday kino topilmadi"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Movies;