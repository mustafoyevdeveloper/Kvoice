import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { MovieGrid } from "@/components/MovieGrid";
import { Footer } from "@/components/Footer";
import { Movie } from "@/components/MovieCard";
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

  // Sample series
  const movies: Movie[] = [
    {
      id: "3",
      title: "Esh yovuz o'liklarga qarshi",
      poster: poster3,
      rating: 8.2,
      year: 2015,
      quality: ["480p", "1080p"],
      category: "series",
      views: 19,
    },
    {
      id: "4",
      title: "Tinchlikparvar DC seriali",
      poster: poster4,
      rating: 9.1,
      year: 2022,
      quality: ["480p", "720p", "1080p"],
      category: "series",
      views: 57,
    },
  ];

  // Filter movies based on search
  const filteredMovies = useMemo(() => {
    if (searchQuery.trim()) {
      return movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return movies;
  }, [searchQuery]);

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