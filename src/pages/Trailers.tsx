import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Eye, Star } from "lucide-react";

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

const Trailers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTrailerClick = (trailer: Trailer) => {
    navigate(`/trailer/${trailer.id}`);
  };

  // Sample trailer data
  const trailers: Trailer[] = [
    {
      id: "1",
      title: "Avengers: Endgame - Official Trailer",
      description: "The epic conclusion to the Infinity Saga. The Avengers must assemble once more to defeat Thanos.",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: "2:30",
      views: 12500000,
      rating: 9.2,
      releaseDate: "2019-04-26",
      category: "action",
      quality: ["4K", "1080p", "720p"]
    },
    {
      id: "2",
      title: "Spider-Man: No Way Home - Teaser",
      description: "Peter Parker's secret identity is revealed, and he must deal with the consequences.",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      duration: "1:45",
      views: 8900000,
      rating: 8.8,
      releaseDate: "2021-12-17",
      category: "action",
      quality: ["4K", "1080p"]
    },
    {
      id: "3",
      title: "Dune - Official Trailer",
      description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset.",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      duration: "3:15",
      views: 6700000,
      rating: 8.5,
      releaseDate: "2021-10-22",
      category: "sci-fi",
      quality: ["4K", "1080p", "720p"]
    },
    {
      id: "4",
      title: "The Batman - Trailer",
      description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      duration: "2:50",
      views: 9800000,
      rating: 8.9,
      releaseDate: "2022-03-04",
      category: "action",
      quality: ["4K", "1080p"]
    },
    {
      id: "5",
      title: "Top Gun: Maverick - Official Trailer",
      description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator.",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      duration: "2:20",
      views: 11200000,
      rating: 9.1,
      releaseDate: "2022-05-27",
      category: "action",
      quality: ["4K", "1080p", "720p"]
    },
    {
      id: "6",
      title: "Black Widow - Final Trailer",
      description: "Natasha Romanoff confronts the darker parts of her ledger when a dangerous conspiracy emerges.",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      duration: "2:05",
      views: 7500000,
      rating: 8.3,
      releaseDate: "2021-07-09",
      category: "action",
      quality: ["4K", "1080p"]
    }
  ];

  const categories = [
    { id: "all", label: "Barchasi", count: trailers.length },
    { id: "action", label: "Jangari", count: trailers.filter(t => t.category === "action").length },
    { id: "sci-fi", label: "Fantastik", count: trailers.filter(t => t.category === "sci-fi").length },
    { id: "comedy", label: "Komediya", count: trailers.filter(t => t.category === "comedy").length },
    { id: "drama", label: "Drama", count: trailers.filter(t => t.category === "drama").length }
  ];

  const filteredTrailers = trailers.filter(trailer => {
    const matchesCategory = selectedCategory === "all" || trailer.category === selectedCategory;
    const matchesSearch = trailer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trailer.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in">
            Treylerlar
          </h1>
          <p className="text-muted-foreground text-lg animate-fade-in">
            Eng yangi va mashhur filmlarning treylerlarini tomosha qiling
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategorySelect(category.id)}
                className="animate-slide-in-left"
              >
                {category.label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Trailers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrailers.map((trailer, index) => (
            <Card
              key={trailer.id}
              className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleTrailerClick(trailer)}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={trailer.thumbnail}
                  alt={trailer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary-glow rounded-full w-16 h-16"
                  >
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    {trailer.duration}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {trailer.quality[0]}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {trailer.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {trailer.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{trailer.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{formatViews(trailer.views)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(trailer.releaseDate)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {trailer.quality.map((q) => (
                    <Badge key={q} variant="outline" className="text-xs">
                      {q}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrailers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">
              Hech qanday treyler topilmadi
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Boshqa qidiruv so'zlarini sinab ko'ring
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Trailers;
