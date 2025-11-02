import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Movie } from "@/components/MovieCard";
import apiService from "@/services/api";

type MoviesContextValue = {
  movies: Movie[];
  addMovie: (movie: Omit<Movie, "id">) => void;
  updateMovie: (id: string, updates: Partial<Omit<Movie, "id">>) => void;
  deleteMovie: (id: string) => void;
  replaceAll: (movies: Movie[]) => void;
  loadMovies: () => Promise<void>;
  isLoading: boolean;
};

const MoviesContext = createContext<MoviesContextValue | undefined>(undefined);

export const MoviesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load movies from API
  const loadMovies = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.movies.getAll({ limit: 1000 });
      if (response.success && response.data) {
        // Convert MongoDB _id to id for frontend compatibility
        const convertedMovies = response.data.map((movie: any) => {
          // Handle poster URL - if it's an API endpoint, prepend base URL
          let posterUrl = movie.poster || movie.posterUrl || '';
          if (posterUrl && posterUrl.startsWith('/api/movies/')) {
            const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
            posterUrl = `${baseUrl}${posterUrl}`;
          }
          
          return {
            id: movie._id || movie.id,
            title: movie.title,
            year: movie.year,
            rating: movie.rating,
            poster: posterUrl,
            description: movie.description,
            category: movie.category,
            language: movie.language,
            genres: movie.genres || [],
            quality: movie.quality || movie.videoQuality || [],
            url: movie.videoLink || movie.videoUrl,
            views: movie.views || 0,
            totalEpisodes: movie.totalEpisodes,
            currentEpisode: movie.currentEpisode
          };
        });
        setMovies(convertedMovies);
      }
    } catch (error) {
      console.error('Failed to load movies:', error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load movies on mount
  useEffect(() => {
    loadMovies();
  }, []);

  const addMovie = (movie: Omit<Movie, "id">) => {
    const id = crypto.randomUUID();
    setMovies((prev) => [{ id, ...movie }, ...prev]);
  };

  const updateMovie = (id: string, updates: Partial<Omit<Movie, "id">>) => {
    setMovies((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMovie = (id: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
  };

  const replaceAll = (list: Movie[]) => setMovies(list);

  const value = useMemo(
    () => ({ movies, addMovie, updateMovie, deleteMovie, replaceAll, loadMovies, isLoading }),
    [movies, isLoading]
  );

  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
};

export const useMovies = (): MoviesContextValue => {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("useMovies must be used within MoviesProvider");
  return ctx;
};
