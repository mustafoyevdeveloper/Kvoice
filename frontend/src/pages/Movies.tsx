import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MovieGrid } from "@/components/MovieGrid";
import { useMovies } from "@/store/movies";

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

  useEffect(() => {
    const saved = localStorage.getItem('moviemedia_site_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      setSiteSettings(settings);
    }
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

  const handleMovieClick = (movie: any) => {
    window.location.href = `/movie/${movie.id}`;
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
            {siteSettings.sectionTitles.movies}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground animate-fade-in-up">
            {siteSettings.sectionDescriptions.movies}
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