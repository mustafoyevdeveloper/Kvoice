import { Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: number;
  year: number;
  quality: string[];
  videoQuality?: string[];
  category: string;
  views: number;
  isNew?: boolean;
  isNewContent?: boolean;
  isPremiere?: boolean;
  url?: string;
  description?: string;
  language?: string;
  videoUrl?: string;
  videoFile?: string;
  videoDuration?: string;
  duration?: string;
  genres?: string[];
  similarContentIds?: string[];
  trailerUrl?: string;
  posterUrl?: string;
}

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const getQualityBadgeClass = (quality: string) => {
    switch (quality) {
      case "480p":
        return "quality-480 text-white text-xs px-2 py-1 rounded";
      case "720p":
        return "quality-720 text-white text-xs px-2 py-1 rounded";
      case "1080p":
        return "quality-1080 text-white text-xs px-2 py-1 rounded";
      default:
        return "bg-muted text-muted-foreground text-xs px-2 py-1 rounded";
    }
  };

  return (
    <div className="movie-card rounded-lg overflow-hidden cursor-pointer group relative touch-feedback"
         onClick={() => onClick(movie)}>
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        <img
          src={movie.poster || movie.posterUrl || '/placeholder-poster.jpg'}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-active:scale-105"
          loading="lazy"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            if (target.src !== '/placeholder-poster.jpg') {
              target.src = '/placeholder-poster.jpg';
            }
          }}
        />
        
        {/* Overlay on hover/touch */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground btn-interactive animate-scale-in">
            <Play className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            <span className="hidden sm:inline">Tomosha qilish</span>
            <span className="sm:hidden">Play</span>
          </Button>
        </div>

        {/* Quality badges - Vertical layout */}
        <div className="absolute top-1 md:top-2 left-1 md:left-2 flex flex-col gap-1">
          {(movie.videoQuality || movie.quality || []).map((q) => (
            <span key={q} className={`${getQualityBadgeClass(q)}`}>
              {q}
            </span>
          ))}
        </div>

        {/* New/Premiere badges */}
        <div className="absolute top-1 md:top-2 right-1 md:right-2 flex flex-col gap-1">
          {(movie.isNew || movie.isNewContent) && (
            <Badge variant="destructive" className="text-xs">
              Yangi
            </Badge>
          )}
          {movie.isPremiere && (
            <Badge variant="default" className="text-xs bg-primary">
              Premyera
            </Badge>
          )}
        </div>

        {/* Rating */}
        <div className="absolute bottom-1 md:bottom-2 left-1 md:left-2 flex items-center space-x-1 bg-black/70 rounded px-1 md:px-2 py-1">
          <Star className="h-2 w-2 md:h-3 md:w-3 text-yellow-400 fill-current" />
          <span className="text-xs text-white font-medium">{movie.rating}</span>
        </div>

        {/* Views */}
        <div className="absolute bottom-1 md:bottom-2 right-1 md:right-2 bg-black/70 rounded px-1 md:px-2 py-1">
          <span className="text-xs text-white">+{movie.views}</span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-2 md:p-3">
        <h3 className="font-semibold text-xs md:text-sm text-card-foreground line-clamp-2 mb-1 md:mb-2 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{movie.year}</span>
        </div>
      </div>
    </div>
  );
};