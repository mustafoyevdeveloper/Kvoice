import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MovieGrid } from "@/components/MovieGrid";
import { useMovies } from "@/store/movies";

export const Premieres = () => {
  const { movies } = useMovies();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("premieres");
  const [siteSettings, setSiteSettings] = useState({
    sectionTitles: {
      premieres: "PREMYERALAR"
    },
    sectionDescriptions: {
      premieres: "Issiq'ida tomosha qilib oling! Hammasi bizda!"
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem('moviemedia_site_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      setSiteSettings(settings);
    }
  }, []);

  // Filter movies for premieres
  const premieresMovies = movies.filter(movie => 
    movie.isPremiere || movie.category === "premieres"
  );

  // Filter by search query
  const filteredMovies = premieresMovies.filter(movie =>
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
    window.location.href = `/premiere/${movie.id}`;
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
            {siteSettings.sectionTitles.premieres}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground animate-fade-in-up">
            {siteSettings.sectionDescriptions.premieres}
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
              {searchQuery ? "Qidiruv natijasi topilmadi" : "Hech qanday premyera topilmadi"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Premieres;