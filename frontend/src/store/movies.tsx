import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Movie } from "@/components/MovieCard";
import poster1 from "@/assets/poster1.jpg";
import poster2 from "@/assets/poster2.jpg";
import poster3 from "@/assets/poster3.jpg";
import poster4 from "@/assets/poster4.jpg";
import poster5 from "@/assets/poster5.jpg";
import poster6 from "@/assets/poster6.jpg";

type MoviesContextValue = {
  movies: Movie[];
  addMovie: (movie: Omit<Movie, "id">) => void;
  updateMovie: (id: string, updates: Partial<Omit<Movie, "id">>) => void;
  deleteMovie: (id: string) => void;
  replaceAll: (movies: Movie[]) => void;
};

const MoviesContext = createContext<MoviesContextValue | undefined>(undefined);

const STORAGE_KEY = "mm_movies_v2";

const seedMovies: Movie[] = [
  // PREMIERES (6 ta)
];

export const MoviesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    // Clear old localStorage data
    localStorage.removeItem('mm_movies');
    
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: Movie[] = JSON.parse(raw);
        setMovies(parsed);
      } catch {
        setMovies(seedMovies);
      }
    } else {
      setMovies(seedMovies);
    }
  }, []);

  useEffect(() => {
    if (movies.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    }
  }, [movies]);

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
    () => ({ movies, addMovie, updateMovie, deleteMovie, replaceAll }),
    [movies]
  );

  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
};

export const useMovies = (): MoviesContextValue => {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("useMovies must be used within MoviesProvider");
  return ctx;
};


