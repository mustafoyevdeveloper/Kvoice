import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MovieGrid } from "@/components/MovieGrid";
import { Footer } from "@/components/Footer";
import { Movie } from "@/components/MovieCard";
import { useMovies } from "@/store/movies";
import { useToast } from "@/hooks/use-toast";

// Import movie posters
import poster1 from "@/assets/poster1.jpg";
import poster2 from "@/assets/poster2.jpg";
import poster3 from "@/assets/poster3.jpg";
import poster4 from "@/assets/poster4.jpg";
import poster5 from "@/assets/poster5.jpg";
import poster6 from "@/assets/poster6.jpg";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { movies } = useMovies();

  // movies now comes from global store

  // Featured movie for hero section
  const featuredFromStore = movies.find(m => m.isPremiere) || movies[0];
  const featuredMovie = featuredFromStore
    ? {
        title: featuredFromStore.title,
        description: "Eng yangi va ajoyib premyera filmi.",
        poster: featuredFromStore.poster,
        rating: featuredFromStore.rating,
        year: featuredFromStore.year,
        quality: featuredFromStore.quality,
      }
    : {
        title: "Yura davri dunyosi: Qayta tug'ilish",
        description: "Eng yangi va ajoyib premyera filmi. Dramatik va hayajonli voqealar bilan to'la muhim kino.",
        poster: poster1,
        rating: 8.5,
        year: 2025,
        quality: ["480p", "720p", "1080p"],
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
      case "premieres":
        return "PREMYERALAR";
      case "movies":
        return "TARJIMA KINOLAR 2025";
      case "series":
        return "SERIALLAR";
      case "new":
        return "YANGI QOSHILGANLAR";
      default:
        return searchQuery ? `"${searchQuery}" UCHUN QIDIRUV NATIJALARI` : "BARCHA KINOLAR";
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

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
        isHomePage={true}
      />
      
      {!searchQuery && selectedCategory === "all" && (
        <Hero featuredMovie={featuredMovie} />
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Category subtitle */}
        {selectedCategory === "premieres" && !searchQuery && (
          <div className="mb-8 text-center">
            <p className="text-primary text-lg font-medium mb-2">
              Issig'ida tomosha qilib oling! Hammasi bizda!
            </p>
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
              movies={movies.filter(m => m.isPremiere)}
              title="PREMYERALAR"
              onMovieClick={handleMovieClick}
            />
            
            <MovieGrid
              movies={movies.filter(m => m.category === "movies")}
              title="TARJIMA KINOLAR 2025"
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