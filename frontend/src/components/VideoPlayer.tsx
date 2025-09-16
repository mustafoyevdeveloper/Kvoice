import { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipBack, 
  SkipForward,
  Settings,
  Download,
  Share2,
  Star,
  Clock,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Movie } from "./MovieCard";
import { useToast } from "@/hooks/use-toast";
import { useMovies } from "@/store/movies";

interface VideoPlayerProps {
  movie: Movie;
  onBack?: () => void;
}

export const VideoPlayer = ({ movie, onBack }: VideoPlayerProps) => {
  const { toast } = useToast();
  const { movies } = useMovies();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState(movie.quality[movie.quality.length - 1]);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Get similar movies based on admin-entered IDs
  const getSimilarMovies = () => {
    if (!movie.similarContentIds || movie.similarContentIds.length === 0) {
      // If no similar content IDs, return random movies from same category
      return movies
        .filter(m => m.id !== movie.id && m.category === movie.category)
        .slice(0, 3);
    }
    
    // Find movies by admin-entered IDs
    const similarMovies = movie.similarContentIds
      .map(id => movies.find(m => m.id === id))
      .filter(Boolean) as Movie[];
    
    // If not enough similar movies found, add random movies from same category
    if (similarMovies.length < 3) {
      const additionalMovies = movies
        .filter(m => m.id !== movie.id && m.category === movie.category && !similarMovies.some(sm => sm.id === m.id))
        .slice(0, 3 - similarMovies.length);
      return [...similarMovies, ...additionalMovies].slice(0, 3);
    }
    
    return similarMovies.slice(0, 3);
  };

  const similarMovies = getSimilarMovies();

  // Auto-hide controls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying, showControls]);

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSettings) {
        const target = event.target as Element;
        if (!target.closest('.settings-dropdown')) {
          setShowSettings(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettings]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const changePlaybackSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const changeQuality = (quality: string) => {
    setSelectedQuality(quality);
    // Here you would typically change the video source
    // For now, we'll just update the state
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: `${movie.title} filmini tomosha qiling!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Havola nusxalandi",
        description: "Kino havolasi clipboardga nusxalandi.",
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: "Yuklab olish boshlandi",
      description: `${movie.title} ${selectedQuality} sifatida yuklab olinmoqda.`,
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Back Button */}
      {onBack && (
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Orqaga qaytish</span>
          </Button>
        </div>
      )}

      {/* Video Player */}
      <div 
        ref={containerRef}
        className={`relative bg-black rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'}`}
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        onTouchStart={() => setShowControls(true)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setIsBuffering(true)}
          onCanPlay={() => setIsBuffering(false)}
          poster={movie.poster}
        >
          <source src={`/api/video/${movie.id}?quality=${selectedQuality}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Loading Overlay */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Play Button Overlay */}
        {!isPlaying && !isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              size="lg" 
              className="bg-primary/80 hover:bg-primary text-primary-foreground rounded-full h-16 w-16 md:h-20 md:w-20 btn-interactive touch-feedback animate-scale-in"
              onClick={togglePlayPause}
            >
              <Play className="h-6 w-6 md:h-8 md:w-8 ml-1" />
            </Button>
          </div>
        )}

        {/* Video Controls */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 md:p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div className="mb-2 md:mb-4">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/70 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 md:space-x-2">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 touch-feedback btn-interactive"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause className="h-4 w-4 md:h-5 md:w-5" /> : <Play className="h-4 w-4 md:h-5 md:w-5" />}
              </Button>

              {/* Skip Buttons - Always visible */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 touch-feedback btn-interactive"
                onClick={() => skip(-10)}
              >
                <SkipBack className="h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs ml-1 hidden sm:inline">10s</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 touch-feedback btn-interactive"
                onClick={() => skip(10)}
              >
                <span className="text-xs mr-1 hidden sm:inline">10s</span>
                <SkipForward className="h-3 w-3 md:h-4 md:w-4" />
              </Button>

              {/* Volume - Always visible */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 touch-feedback btn-interactive"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? 
                    <VolumeX className="h-4 w-4" /> : 
                    <Volume2 className="h-4 w-4" />
                  }
                </Button>
                <div className="w-16 md:w-20">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 md:space-x-2">
              {/* Quality Selector */}
              <Select value={selectedQuality} onValueChange={changeQuality}>
                <SelectTrigger className="w-16 md:w-20 h-6 md:h-8 bg-transparent border-white/30 text-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {movie.quality.map((quality) => (
                    <SelectItem key={quality} value={quality}>
                      {quality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Settings Menu */}
              <div className="relative settings-dropdown">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 touch-feedback btn-interactive"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>

                {/* Settings Dropdown */}
                {showSettings && (
                  <div className="absolute bottom-12 right-0 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-48 border border-white/20 z-50">
                    <div className="space-y-4">
                      {/* Playback Speed */}
                      <div>
                        <h4 className="text-white text-sm font-medium mb-2">Tezlik</h4>
                        <div className="space-y-2">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                            <Button
                              key={speed}
                              variant={playbackSpeed === speed ? "default" : "ghost"}
                              size="sm"
                              className="w-full justify-start text-white hover:bg-white/20"
                              onClick={() => changePlaybackSpeed(speed)}
                            >
                              {speed}x
                              {playbackSpeed === speed && " ✓"}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 touch-feedback btn-interactive"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? 
                  <Minimize className="h-4 w-4" /> : 
                  <Maximize className="h-4 w-4" />
                }
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Movie Details */}
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 space-y-4 md:space-y-0">
                <div className="space-y-2">
                  <h1 className="text-xl md:text-3xl font-bold text-foreground animate-fade-in-up">{movie.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-muted-foreground text-sm md:text-base">
                    <span className="flex items-center space-x-1">
                      <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-current" />
                      <span>{movie.rating}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 md:h-4 md:w-4" />
                      <span>{movie.year}</span>
                    </span>
                    <Badge variant="secondary" className="text-xs">{movie.category}</Badge>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare} className="btn-interactive touch-feedback">
                    <Share2 className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                    <span className="hidden sm:inline">Ulashish</span>
                    <span className="sm:hidden">Share</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload} className="btn-interactive touch-feedback">
                    <Download className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                    <span className="hidden sm:inline">Yuklab olish</span>
                    <span className="sm:hidden">Download</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Tavsif</h3>
                  <p className="text-muted-foreground">
                    {movie.description || "Bu ajoyib kino sizga unutilmas taassurotlar beradi. Zo'r syujet va professional aktyorlar ishlagan bu asarda siz hayotning turli jihatlarini ko'rasiz."}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Janr</span>
                    <p className="font-medium">
                      {movie.genres && movie.genres.length > 0 
                        ? movie.genres.join(", ") 
                        : "Dramatik, Fantastik"
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Davomiyligi</span>
                    <p className="font-medium">
                      {movie.duration || "2s 15min"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Til</span>
                    <p className="font-medium">
                      {movie.language || "O'zbek tilida"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Ko'rishlar</span>
                    <p className="font-medium">{movie.views.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Quality Options */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Sifat Tanlash</h3>
              <div className="space-y-2">
                {movie.quality
                  .sort((a, b) => {
                    const qualityOrder = ["360p", "480p", "720p", "1080p", "1440p", "4K"];
                    return qualityOrder.indexOf(a) - qualityOrder.indexOf(b);
                  })
                  .map((quality) => (
                  <Button
                    key={quality}
                    variant={selectedQuality === quality ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedQuality(quality)}
                  >
                    {quality} - {quality === "4K" ? "Ultra HD" : quality === "1440p" ? "2K" : quality === "1080p" ? "Full HD" : quality === "720p" ? "HD" : quality === "480p" ? "Standart" : "SD"}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Movies */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">O'xshash Kinolar</h3>
              <div className="space-y-3">
                {similarMovies.map((similarMovie) => (
                  <div 
                    key={similarMovie.id} 
                    className="flex space-x-3 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                    onClick={() => window.location.href = `/movie/${similarMovie.id}`}
                  >
                    <div className="w-16 h-24 bg-muted rounded overflow-hidden">
                      <img 
                        src={similarMovie.poster} 
                        alt={similarMovie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-medium">{similarMovie.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {similarMovie.year} • {similarMovie.rating}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};