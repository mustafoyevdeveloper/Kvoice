import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Eye, Calendar, Share2, Download } from "lucide-react";

interface Trailer {
  id: string;
  title: string;
  description: string;
  poster: string;
  videoUrl: string;
  duration: string;
  views: number;
  rating: number;
  year: number;
  category: string;
  quality: string[];
}

const TrailerPlayer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sample trailer data (in real app, this would come from API)
  const trailer: Trailer = {
    id: id || "1",
    title: "Avengers: Endgame - Official Trailer",
    description: "The epic conclusion to the Infinity Saga. The Avengers must assemble once more to defeat Thanos and restore balance to the universe. This is the culmination of over 20 films and 10 years of storytelling.",
    poster: "/api/placeholder/800/450",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "2:30",
    views: 12500000,
    rating: 9.2,
    year: 2019,
    category: "action",
    quality: ["4K", "1080p", "720p", "480p"]
  };

  const handleCategorySelect = (category: string) => {
    navigate(category === "all" ? "/" : `/${category}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: trailer.title,
        text: trailer.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = () => {
    // Download functionality
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  // Convert trailer to movie format for VideoPlayer component
  const movie = {
    id: trailer.id,
    title: trailer.title,
    poster: trailer.poster,
    rating: trailer.rating,
    year: trailer.year,
    quality: trailer.quality,
    category: trailer.category,
    views: trailer.views,
    isPremiere: false,
    isNew: false,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        selectedCategory="trailers"
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Video Player */}
        <VideoPlayer movie={movie} onBack={() => navigate(-1)} />

        {/* Removed duplicate info/sidebar to avoid double sections; VideoPlayer already shows details. */}
      </main>

      <Footer />
    </div>
  );
};

export default TrailerPlayer;
