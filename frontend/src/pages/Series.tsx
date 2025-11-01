import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MovieGrid } from "@/components/MovieGrid";
import { useMovies } from "@/store/movies";

export const Series = () => {
  const { movies } = useMovies();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("series");
  const [siteSettings, setSiteSettings] = useState({
    sectionTitles: {
      series: "SERIALLAR"
    },
    sectionDescriptions: {
      series: "Mashhur seriallar va multfilmlar"
    }
  });

  // Site settings are now loaded from backend, no localStorage needed

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  // Filter movies for series category
  const seriesList = movies.filter(movie => 
    movie.category === "series"
  );

  // Filter by search query
  const filteredMovies = seriesList.filter(movie =>
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
    window.location.href = `/series/${movie.id}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in">
            {siteSettings.sectionTitles.series}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground animate-fade-in-up">
            {siteSettings.sectionDescriptions.series}
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
              {searchQuery ? "Qidiruv natijasi topilmadi" : "Hech qanday serial topilmadi"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Series;