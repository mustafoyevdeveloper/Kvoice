import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Movie } from "@/components/MovieCard";

// Import movie posters
import poster1 from "@/assets/poster1.jpg";
import poster2 from "@/assets/poster2.jpg";
import poster3 from "@/assets/poster3.jpg";
import poster4 from "@/assets/poster4.jpg";
import poster5 from "@/assets/poster5.jpg";
import poster6 from "@/assets/poster6.jpg";

const MoviePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Sample movie data (would come from backend)
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

  const movie = movies.find(m => m.id === id);

  const handleCategorySelect = (category: string) => {
    navigate(category === "all" ? "/" : `/${category}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onSearch={handleSearch}
          onCategorySelect={handleCategorySelect}
          selectedCategory="all"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Kino topilmadi</h1>
            <p className="text-muted-foreground">Siz qidirayotgan kino mavjud emas.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        selectedCategory="all"
      />
      
      <main className="container mx-auto px-4 py-8">
        <VideoPlayer movie={movie} />
      </main>

      <Footer />
    </div>
  );
};

export default MoviePlayer;