import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MovieGrid } from "@/components/MovieGrid";
import { useMovies } from "@/store/movies";

export const Trailers = () => {
  const { movies } = useMovies();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("trailers");
  const [siteSettings, setSiteSettings] = useState({
    sectionTitles: {
      trailers: "TREYLERLAR"
    },
    sectionDescriptions: {
      trailers: "Eng so'nggi treylerlar"
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem('moviemedia_site_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      setSiteSettings(settings);
    }
  }, []);

  // Filter movies for trailers category
  const trailersList = movies.filter(movie => 
    movie.category === "trailers" || movie.category === "trailer"
  );

  // Filter by search query
  const filteredMovies = trailersList.filter(movie =>
    !searchQuery.trim() || 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleMovieClick = (movie: any) => {
    window.location.href = `/trailer/${movie.id}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in">
            {siteSettings.sectionTitles.trailers}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground animate-fade-in-up">
            {siteSettings.sectionDescriptions.trailers}
          </p>
        </div>

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
              {searchQuery ? "Qidiruv natijasi topilmadi" : "Hech qanday treyler topilmadi"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Trailers;