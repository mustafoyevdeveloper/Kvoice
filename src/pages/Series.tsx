import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { MovieGrid } from "@/components/MovieGrid";
import { Footer } from "@/components/Footer";
import { Movie } from "@/components/MovieCard";
import { useMovies } from "@/store/movies";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Import movie posters
import poster1 from "@/assets/poster1.jpg";
import poster2 from "@/assets/poster2.jpg";
import poster3 from "@/assets/poster3.jpg";
import poster4 from "@/assets/poster4.jpg";
import poster5 from "@/assets/poster5.jpg";
import poster6 from "@/assets/poster6.jpg";

const Series = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { movies } = useMovies();

  // using global store

  // Filter movies based on search
  const filteredMovies = useMemo(() => {
    let list = movies.filter(m => m.category === "series");
    if (searchQuery.trim()) {
      list = list.filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  }, [searchQuery, movies]);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleCategorySelect = (category: string) => {
    navigate(category === "all" ? "/" : `/${category}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        selectedCategory="series"
      />
      
      <main className="container mx-auto px-4 py-8">
        <MovieGrid
          movies={filteredMovies}
          title="SERIALLAR"
          onMovieClick={handleMovieClick}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Series;