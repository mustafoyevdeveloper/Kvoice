import { MovieCard, Movie } from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  title: string;
  onMovieClick: (movie: Movie) => void;
}

export const MovieGrid = ({ movies, title, onMovieClick }: MovieGridProps) => {
  if (movies.length === 0) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Hech qanday kino topilmadi</p>
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
          <span className="text-sm text-muted-foreground">
            {movies.length} ta kino
          </span>
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