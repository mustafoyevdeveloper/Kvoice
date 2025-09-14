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

const Premieres = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Sample premiere movies
  const movies: Movie[] = [
    {
      id: "1",
      title: "Yura davri dunyosi: Qayta tug'ilish",
      poster: poster1,
      rating: 8.5,
      year: 2025,
      quality: ["480p", "720p", "1080p"],
      category: "premieres",
      views: 194,
      isPremiere: true,
      isNew: true,
    },
    {
      id: "2", 
      title: "Osiris: Yirtqich missiyasi",
      poster: poster2,
      rating: 7.8,
      year: 2025,
      quality: ["480p", "720p", "1080p"],
      category: "premieres",
      views: 85,
      isPremiere: true,
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
        selectedCategory="premieres"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <p className="text-primary text-lg font-medium mb-2">
            Issig'ida tomosha qilib oling! Hammasi bizda!
          </p>
        </div>

        <MovieGrid
          movies={filteredMovies}
          title="PREMYERALAR"
          onMovieClick={handleMovieClick}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Premieres;