import { Star, Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: number;
  year: number;
  quality: string[];
  category: string;
  views: number;
  isNew?: boolean;
  isPremiere?: boolean;
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
    <div className="movie-card rounded-lg overflow-hidden cursor-pointer group relative"
         onClick={() => onClick(movie)}>
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground">
            <Play className="h-5 w-5 mr-2" />
            Tomosha qilish
          </Button>
        </div>

        {/* Quality badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {movie.quality.map((q) => (
            <span key={q} className={getQualityBadgeClass(q)}>
              {q}
            </span>
          ))}
        </div>

        {/* New/Premiere badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {movie.isNew && (
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
        <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black/70 rounded px-2 py-1">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-xs text-white font-medium">{movie.rating}</span>
        </div>

        {/* Views */}
        <div className="absolute bottom-2 right-2 bg-black/70 rounded px-2 py-1">
          <span className="text-xs text-white">+{movie.views}</span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-card-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{movie.year}</span>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:text-primary">
            <Download className="h-3 w-3 mr-1" />
            Yuklab olish
          </Button>
        </div>
      </div>
    </div>
  );
};