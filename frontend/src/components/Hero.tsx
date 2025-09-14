import { Play, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroProps {
  featuredMovie: {
    title: string;
    description: string;
    poster: string;
    rating: number;
    year: number;
    quality: string[];
  };
}

export const Hero = ({ featuredMovie }: HeroProps) => {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Movie Info */}
          <div className="mb-6">
            <Badge variant="default" className="mb-4 bg-primary text-primary-foreground">
              Eng so'nggi 2025 Tarjima Kinolar
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in">
              {featuredMovie.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 animate-slide-up">
              {featuredMovie.description}
            </p>
          </div>

          {/* Movie Details */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="font-medium">{featuredMovie.rating}</span>
            </div>
            <span>•</span>
            <span>{featuredMovie.year}</span>
            <span>•</span>
            <div className="flex gap-2">
              {featuredMovie.quality.map((q) => (
                <Badge key={q} variant="outline" className="border-primary/30 text-primary">
                  {q}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground px-8 animate-glow-pulse">
              <Play className="h-5 w-5 mr-2" />
              Tomosha qilish
            </Button>
            <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 px-8">
              <Info className="h-5 w-5 mr-2" />
              Batafsil ma'lumot
            </Button>
          </div>

          {/* Description */}
          <div className="mt-8 text-center">
            <p className="text-primary font-medium mb-2">
              Issiq'ida tomosha qilib oling! Hammasi bizda!
            </p>
            <p className="text-sm text-muted-foreground">
              barchasi faqat bizda!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};