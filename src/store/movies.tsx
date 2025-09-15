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

const STORAGE_KEY = "mm_movies";

const seedMovies: Movie[] = [
  {
    id: "1",
    title: "Yura davri dunyosi: Qayta tug'ilish",
    poster: poster1,
    rating: 8.5,
    year: 2025,
    quality: ["480p", "720p", "1080p"],
    category: "premieres",
    views: 194,
    isPremiere: true,
    isNew: true,
  },
  {
    id: "2",
    title: "Osiris: Yirtqich missiyasi",
    poster: poster2,
    rating: 7.8,
    year: 2025,
    quality: ["480p", "720p", "1080p"],
    category: "premieres",
    views: 85,
    isPremiere: true,
  },
  {
    id: "3",
    title: "Esh yovuz o'liklarga qarshi",
    poster: poster3,
    rating: 8.2,
    year: 2015,
    quality: ["480p", "1080p"],
    category: "series",
    views: 19,
  },
  {
    id: "4",
    title: "Tinchlikparvar DC seriali",
    poster: poster4,
    rating: 9.1,
    year: 2022,
    quality: ["480p", "720p", "1080p"],
    category: "series",
    views: 57,
  },
  {
    id: "5",
    title: "Urush va Jang 2: Hind kino",
    poster: poster5,
    rating: 8.7,
    year: 2025,
    quality: ["480p", "720p", "1080p"],
    category: "movies",
    views: 143,
    isNew: true,
  },
  {
    id: "6",
    title: "Qizil Sonya: Qizilsoch Sonya",
    poster: poster6,
    rating: 7.5,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "movies",
    views: 38,
  },
];

export const MoviesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
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


