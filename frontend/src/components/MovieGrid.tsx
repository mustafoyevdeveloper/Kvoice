import { MovieCard, Movie } from "./MovieCard";
import { MovieCardSkeleton } from "./MovieCardSkeleton";

interface MovieGridProps {
  movies: Movie[];
  title: string;
  onMovieClick: (movie: Movie) => void;
  isLoading?: boolean;
}

export const MovieGrid = ({ movies, title, onMovieClick, isLoading = false }: MovieGridProps) => {
  // Show skeleton loaders while loading
  if (isLoading) {
    const skeletonCount = 12; // Number of skeleton cards to show
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <MovieCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (movies.length === 0) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg"></p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={onMovieClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};