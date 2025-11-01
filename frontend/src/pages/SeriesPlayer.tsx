import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Movie } from "@/components/MovieCard";
import { useMovies } from "@/store/movies";

const SeriesPlayer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { movies } = useMovies();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Find movie from store
  const movie = movies?.find(m => m.id === id);

  const handleCategorySelect = (category: string) => {
    navigate(category === "all" ? "/" : `/${category}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          onSearch={handleSearch}
          onCategorySelect={handleCategorySelect}
          selectedCategory="series"
        />
        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Serial topilmadi</h1>
            <p className="text-muted-foreground">Siz qidirayotgan serial mavjud emas.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        selectedCategory="series"
      />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <VideoPlayer movie={movie} onBack={() => navigate(-1)} />
      </main>

      <Footer />
    </div>
  );
};

export default SeriesPlayer;
