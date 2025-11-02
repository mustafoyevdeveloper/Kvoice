import { Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useMovies } from "@/store/movies";
import { useNavigate } from "react-router-dom";
import useSettingsStore from "@/store/settings";

interface HeroProps {
  featuredMovie?: {
    title: string;
    description: string;
    poster: string;
    rating: number;
    year: number;
    quality: string[];
  };
}

export const Hero = ({ featuredMovie }: HeroProps) => {
  const navigate = useNavigate();
  const { movies } = useMovies();
  
  // Site settings
  const { settings } = useSettingsStore();

  // Get the latest added content (most recent by ID or by order in array)
  const getLatestContent = () => {
    if (!movies || movies.length === 0) return null;
    
    // Sort by ID to get the latest (assuming newer IDs are higher)
    const sortedMovies = [...movies].sort((a, b) => {
      // Extract numbers from ID for comparison
      const aNum = parseInt(a.id.replace(/\D/g, '')) || 0;
      const bNum = parseInt(b.id.replace(/\D/g, '')) || 0;
      return bNum - aNum;
    });
    
    return sortedMovies[0];
  };

  const handlePlayClick = () => {
    const latestContent = getLatestContent();
    if (latestContent) {
      // Agar videoLink bo'lsa, Telegram'ga yo'naltiramiz
      const videoLink = latestContent.videoLink || latestContent.videoUrl;
      if (videoLink && (videoLink.startsWith('http://') || videoLink.startsWith('https://'))) {
        window.open(videoLink, '_blank');
        return;
      }
      
      // Navigate to appropriate player based on content type
      if (latestContent.category === 'movies') {
        navigate(`/movie/${latestContent.id}`);
      } else if (latestContent.category === 'series') {
        navigate(`/series/${latestContent.id}`);
      } else {
        // Default to movie player
        navigate(`/movie/${latestContent.id}`);
      }
    }
  };

  // featuredMovie is always provided from Index.tsx (has default values)

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-bg"
        style={{ 
          backgroundImage: 'url(/Heroimg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Movie Info */}
          <div className="mb-4 md:mb-6">
            <Badge variant="default" className="mb-3 md:mb-4 bg-black/15 p-2 rounded-md w-fit mx-auto text-primary-foreground">
              Eng so'nggi Koreya Kinolar va Seriallari
            </Badge>
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-foreground mb-3 md:mb-4 animate-fade-in-up leading-tight">
              {featuredMovie.title}
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-yellow-400 max-w-2xl mx-auto mb-4 md:mb-6 animate-slide-up px-4">
              {featuredMovie.description}
            </p>
          </div>

          {/* Movie Details */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-6 md:mb-8 text-xs md:text-sm text-white animate-fade-in-up">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-current" />
              <span className="font-medium text-white-400">{featuredMovie.rating}</span>
            </div>
            <span className="hidden md:inline text-white">•</span>
            <span className="text-white">{featuredMovie.year}</span>
            <span className="hidden md:inline text-white">•</span>
            <div className="flex gap-1 md:gap-2">
              {featuredMovie.quality.map((q) => (
                <Badge key={q} variant="outline" className="border-red-800 text-white text-xs">
                  {q}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center animate-fade-in-up">
            <Button 
              size="lg" 
              onClick={handlePlayClick}
              className="bg-red/60 hover:bg-red-glow/60 text-white-foreground px-6 md:px-8 animate-glow-pulse btn-interactive touch-feedback w-full sm:w-auto min-w-[250px] md:min-w-[300px] lg:min-w-[350px]"
            >
              <Play className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Tomosha qilish
            </Button>
          </div>

          {/* Description */}
          <div className="mt-6 md:mt-8 text-center animate-fade-in-up">
            <p className="text-white font-medium mb-1 md:mb-2 text-sm md:text-base">
              {settings?.heroTitle || "Eng yaxshi kinolar va seriallar"}
            </p>
            <p className="text-xs md:text-sm bg-black/15 p-2 rounded-md w-fit mx-auto text-white-foreground">
              {settings?.heroSubtitle || "O'zbek tilida eng yangi va mashhur kinolar"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};