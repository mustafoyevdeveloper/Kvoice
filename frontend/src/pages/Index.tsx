import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MovieGrid } from "@/components/MovieGrid";
import { Footer } from "@/components/Footer";
import { Movie } from "@/components/MovieCard";
import { useMovies } from "@/store/movies";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";


const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { movies } = useMovies();

  // Set page title and scroll to top when component mounts
  useEffect(() => {
    document.title = "Kvoice - Koreya kinolari va seriallari O'zbek tilida";
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  // movies now comes from global store

  // Featured movie for hero section - from MongoDB or default
  const featuredFromStore = movies.find(m => m.category === 'movies') || movies.find(m => m.category === 'series') || movies[0];
  const featuredMovie = featuredFromStore
    ? {
        title: featuredFromStore.title,
        description: featuredFromStore.description || "Eng yangi va ajoyib premyera filmi.",
        poster: featuredFromStore.poster,
        rating: featuredFromStore.rating,
        year: featuredFromStore.year,
        quality: featuredFromStore.quality || [],
      }
    : {
        // Default hero content when no movies in database
        title: "Kvoice",
        description: "Eng yangi va ajoyib Koreya kinolari va seriallari O'zbek tilida. HD va 4K sifatda barcha kontentlar mavjud.",
        poster: "",
        rating: 8.5,
        year: new Date().getFullYear(),
        quality: ["720p", "1080p", "4K"],
      };

  // Filter movies based on category and search
  const filteredMovies = useMemo(() => {
    let filtered = movies;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(movie => movie.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  // Get category title
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "movies":
        return "KINOLAR";
      case "series":
        return "SERIALLAR";
      default:
        return searchQuery ? `"${searchQuery}" UCHUN QIDIRUV NATIJALARI` : "BARCHA KINOLAR VA SERIALLAR";
    }
  };

  const handleMovieClick = (movie: Movie) => {
    window.location.href = `/movie/${movie.id}`;
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when selecting category
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSelectedCategory("all"); // Show all categories when searching
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
        isHomePage={true}
      />
      
      {!searchQuery && selectedCategory === "all" && (
        <Hero featuredMovie={featuredMovie} />
      )}

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


        <MovieGrid
          movies={filteredMovies}
          title={getCategoryTitle(selectedCategory)}
          onMovieClick={handleMovieClick}
        />

        {/* Additional sections for full experience */}
        {selectedCategory === "all" && !searchQuery && (
          <>
            <MovieGrid
              movies={movies.filter(m => m.category === "movies")}
              title="KINOLAR"
              onMovieClick={handleMovieClick}
            />
            
            <MovieGrid
              movies={movies.filter(m => m.category === "series")}
              title="SERIALLAR"
              onMovieClick={handleMovieClick}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;