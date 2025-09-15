import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Settings, Maximize, Star, Eye, Calendar, Share2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Trailer {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  views: number;
  rating: number;
  releaseDate: string;
  category: string;
  quality: string[];
}

const TrailerPlayer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sample trailer data (in real app, this would come from API)
  const trailer: Trailer = {
    id: id || "1",
    title: "Avengers: Endgame - Official Trailer",
    description: "The epic conclusion to the Infinity Saga. The Avengers must assemble once more to defeat Thanos and restore balance to the universe. This is the culmination of over 20 films and 10 years of storytelling.",
    thumbnail: "/api/placeholder/800/450",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "2:30",
    views: 12500000,
    rating: 9.2,
    releaseDate: "2019-04-26",
    category: "action",
    quality: ["4K", "1080p", "720p", "480p"]
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={() => {}}
        onCategorySelect={() => {}}
        selectedCategory="trailers"
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Orqaga qaytish</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-black">
                <video
                  className="w-full h-full object-contain"
                  poster={trailer.thumbnail}
                  controls
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
                >
                  <source src={trailer.videoUrl} type="video/mp4" />
                  Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi.
                </video>
              </div>
              
              {/* Custom Controls */}
              <div className="p-4 bg-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePlayPause}
                      className="hover:bg-primary/10"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMuteToggle}
                      className="hover:bg-primary/10"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    
                    <div className="text-sm text-muted-foreground">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Select value={selectedQuality} onValueChange={handleQualityChange}>
                      <SelectTrigger className="w-20 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {trailer.quality.map((quality) => (
                          <SelectItem key={quality} value={quality}>
                            {quality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSettings(!showSettings)}
                        className="hover:bg-primary/10"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      
                      {showSettings && (
                        <div className="absolute bottom-10 right-0 bg-card border rounded-lg p-3 min-w-32 shadow-lg z-10">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Tezlik</div>
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                              <Button
                                key={speed}
                                variant={playbackSpeed === speed ? "default" : "ghost"}
                                size="sm"
                                className="w-full justify-start text-xs"
                                onClick={() => handleSpeedChange(speed)}
                              >
                                {speed}x
                                {playbackSpeed === speed && " ✓"}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFullscreen}
                      className="hover:bg-primary/10"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Trailer Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-4">{trailer.title}</h1>
                
                <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{trailer.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{formatViews(trailer.views)} ko'rish</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(trailer.releaseDate)}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {trailer.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {trailer.quality.map((q) => (
                    <Badge key={q} variant="outline">
                      {q}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={handleShare} className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Ulashish
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Trailers */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Tegishli Treylerlar</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex space-x-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                      <div className="w-20 h-12 bg-muted rounded flex items-center justify-center">
                        <Play className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">
                          Related Trailer {i}
                        </h4>
                        <p className="text-xs text-muted-foreground">2:30</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrailerPlayer;
