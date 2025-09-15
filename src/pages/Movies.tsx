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

const Movies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Sample movies
  const movies: Movie[] = [
    {
      id: "5",
      title: "Urush va Jang 2: Hind kino",
      poster: poster5,
      rating: 8.7,
      year: 2025,
      quality: ["480p", "720p", "1080p"],
      category: "movies",
      views: 143,
      isNew: true,
    },
    {
      id: "6",
      title: "Qizil Sonya: Qizilsoch Sonya",
      poster: poster6,
      rating: 7.5,
      year: 2024,
      quality: ["480p", "720p", "1080p"],
      category: "movies",
      views: 38,
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
        selectedCategory="movies"
      />
      
      <main className="container mx-auto px-4 py-8">
        <MovieGrid
          movies={filteredMovies}
          title="TARJIMA KINOLAR 2025"
          onMovieClick={handleMovieClick}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Movies;