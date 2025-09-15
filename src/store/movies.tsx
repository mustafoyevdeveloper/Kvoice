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
    title: "Avatar: Suv yo'li",
    poster: poster3,
    rating: 9.2,
    year: 2025,
    quality: ["480p", "720p", "1080p", "4K"],
    category: "premieres",
    views: 324,
    isPremiere: true,
  },
  {
    id: "4",
    title: "Spider-Man: Uyga qaytish",
    poster: poster4,
    rating: 8.9,
    year: 2025,
    quality: ["480p", "720p", "1080p"],
    category: "premieres",
    views: 267,
    isPremiere: true,
  },
  {
    id: "5",
    title: "Batman: Qorong'u ritsar",
    poster: poster5,
    rating: 8.7,
    year: 2025,
    quality: ["480p", "720p", "1080p"],
    category: "premieres",
    views: 198,
    isPremiere: true,
  },
  {
    id: "6",
    title: "Fast & Furious 11",
    poster: poster6,
    rating: 8.1,
    year: 2025,
    quality: ["480p", "720p", "1080p"],
    category: "premieres",
    views: 156,
    isPremiere: true,
  },

  // MOVIES (6 ta)
  {
    id: "7",
    title: "Urush va Jang 2: Hind kino",
    poster: poster1,
    rating: 8.7,
    year: 2025,
    quality: ["480p", "720p", "1080p"],
    category: "movies",
    views: 143,
    isNew: true,
  },
  {
    id: "8",
    title: "Qizil Sonya: Qizilsoch Sonya",
    poster: poster2,
    rating: 7.5,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "movies",
    views: 38,
  },
  {
    id: "9",
    title: "Mission Impossible 8",
    poster: poster3,
    rating: 8.3,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "movies",
    views: 89,
  },
  {
    id: "10",
    title: "John Wick 5",
    poster: poster4,
    rating: 8.8,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "movies",
    views: 112,
  },
  {
    id: "11",
    title: "Transformers: Rise of the Beasts",
    poster: poster5,
    rating: 7.9,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "movies",
    views: 67,
  },
  {
    id: "12",
    title: "Guardians of the Galaxy 3",
    poster: poster6,
    rating: 8.4,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "movies",
    views: 95,
  },

  // SERIES (6 ta)
  {
    id: "13",
    title: "Esh yovuz o'liklarga qarshi",
    poster: poster1,
    rating: 8.2,
    year: 2015,
    quality: ["480p", "1080p"],
    category: "series",
    views: 19,
  },
  {
    id: "14",
    title: "Tinchlikparvar DC seriali",
    poster: poster2,
    rating: 9.1,
    year: 2022,
    quality: ["480p", "720p", "1080p"],
    category: "series",
    views: 57,
  },
  {
    id: "15",
    title: "Stranger Things 5",
    poster: poster3,
    rating: 8.9,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "series",
    views: 234,
  },
  {
    id: "16",
    title: "The Witcher 4",
    poster: poster4,
    rating: 8.6,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "series",
    views: 178,
  },
  {
    id: "17",
    title: "House of the Dragon 2",
    poster: poster5,
    rating: 9.0,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "series",
    views: 312,
  },
  {
    id: "18",
    title: "The Mandalorian 4",
    poster: poster6,
    rating: 8.7,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "series",
    views: 145,
  },

  // TRAILERS (6 ta)
  {
    id: "19",
    title: "Avengers: Secret Wars - Treyler",
    poster: poster1,
    rating: 9.5,
    year: 2025,
    quality: ["480p", "720p", "1080p", "4K"],
    category: "trailers",
    views: 1250,
  },
  {
    id: "20",
    title: "Deadpool 3 - Treyler",
    poster: poster2,
    rating: 9.2,
    year: 2025,
    quality: ["480p", "720p", "1080p"],
    category: "trailers",
    views: 890,
  },
  {
    id: "21",
    title: "Black Panther 3 - Treyler",
    poster: poster3,
    rating: 9.0,
    year: 2025,
    quality: ["480p", "720p", "1080p"],
    category: "trailers",
    views: 756,
  },
  {
    id: "22",
    title: "X-Men: Apocalypse 2 - Treyler",
    poster: poster4,
    rating: 8.8,
    year: 2025,
    quality: ["480p", "720p", "1080p"],
    category: "trailers",
    views: 634,
  },
  {
    id: "23",
    title: "Thor 5: Ragnarok 2 - Treyler",
    poster: poster5,
    rating: 8.9,
    year: 2025,
    quality: ["480p", "720p", "1080p"],
    category: "trailers",
    views: 567,
  },
  {
    id: "24",
    title: "Captain America 5 - Treyler",
    poster: poster6,
    rating: 9.1,
    year: 2025,
    quality: ["480p", "720p", "1080p"],
    category: "trailers",
    views: 723,
  },

  // NEW (6 ta)
  {
    id: "25",
    title: "Dune: Part Two",
    poster: poster1,
    rating: 8.9,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "movies",
    views: 45,
    isNew: true,
  },
  {
    id: "26",
    title: "Oppenheimer",
    poster: poster2,
    rating: 9.3,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "movies",
    views: 78,
    isNew: true,
  },
  {
    id: "27",
    title: "Barbie",
    poster: poster3,
    rating: 8.1,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "movies",
    views: 92,
    isNew: true,
  },
  {
    id: "28",
    title: "Top Gun: Maverick 2",
    poster: poster4,
    rating: 8.6,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "movies",
    views: 67,
    isNew: true,
  },
  {
    id: "29",
    title: "The Batman 2",
    poster: poster5,
    rating: 8.4,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "movies",
    views: 83,
    isNew: true,
  },
  {
    id: "30",
    title: "Sonic the Hedgehog 3",
    poster: poster6,
    rating: 7.8,
    year: 2024,
    quality: ["480p", "720p", "1080p"],
    category: "movies",
    views: 56,
    isNew: true,
  },
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


