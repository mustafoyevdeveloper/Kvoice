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
  videoLink?: string; // Telegram link for video
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

  const getLanguageLabel = (lang: string | undefined) => {
    if (!lang) return '';
    const langMap: Record<string, string> = {
      'uzbek': 'O\'zbek',
      'russian': 'Rus',
      'english': 'Ingliz',
      'german': 'Nemis',
      'spanish': 'Ispan',
      'italian': 'Italyan',
      'japanese': 'Yapon',
      'chinese': 'Xitoy',
      'turkish': 'Turk',
      'korean': 'Koreys'
    };
    return langMap[lang.toLowerCase()] || lang;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Agar videoLink bo'lsa va u URL bo'lsa, to'g'ridan-to'g'ri ochiladi
    const videoLink = movie.videoLink || movie.videoUrl || movie.url;
    if (videoLink && (videoLink.startsWith('http://') || videoLink.startsWith('https://'))) {
      window.open(videoLink, '_blank');
    } else {
      onClick(movie);
    }
  };

  const handleWatchButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const videoLink = movie.videoLink || movie.videoUrl || movie.url;
    if (videoLink && (videoLink.startsWith('http://') || videoLink.startsWith('https://'))) {
      window.open(videoLink, '_blank');
    } else {
      onClick(movie);
    }
  };

  return (
    <div className="movie-card rounded-lg overflow-hidden cursor-pointer group relative touch-feedback"
         onClick={handleCardClick}>
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
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary-glow text-primary-foreground btn-interactive animate-scale-in"
            onClick={handleWatchButtonClick}
          >
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
      </div>

      {/* Movie Info */}
      <div className="p-2 md:p-3">
        {/* Nomi */}
        <h3 className="font-semibold text-xs md:text-sm text-card-foreground line-clamp-2 mb-1 md:mb-2 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        
        {/* Tavsifi */}
        {movie.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {movie.description}
          </p>
        )}
        
        {/* Yili, Tili, Reytingi, Janri */}
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 flex-wrap">
            <span>📅 {movie.year}</span>
            {movie.language && (
              <span>🌐 {getLanguageLabel(movie.language)}</span>
            )}
            <span className="flex items-center gap-1">
              ⭐ {movie.rating}
            </span>
          </div>
          
          {/* Janri */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-muted-foreground">🎭</span>
              {movie.genres.slice(0, 3).map((genre, index) => (
                <span key={index} className="text-xs">
                  {genre}{index < Math.min(movie.genres!.length, 3) - 1 ? ',' : ''}
                </span>
              ))}
              {movie.genres.length > 3 && (
                <span className="text-xs">+{movie.genres.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};