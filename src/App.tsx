import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Premieres from "./pages/Premieres";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import New from "./pages/New";
import Admin from "./pages/Admin";
import MoviePlayer from "./pages/MoviePlayer";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Trailers from "./pages/Trailers";
import TrailerPlayer from "./pages/TrailerPlayer";
import NotFound from "./pages/NotFound";
import { MoviesProvider } from "./store/movies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MoviesProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/premieres" element={<Premieres />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/new" element={<New />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/movie/:id" element={<MoviePlayer />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/trailers" element={<Trailers />} />
          <Route path="/trailer/:id" element={<TrailerPlayer />} />
          <Route path="/premiere/:id" element={<PremieresPlayer />} />
          <Route path="/series/:id" element={<SeriesPlayer />} />
          <Route path="/new/:id" element={<NewPlayer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </MoviesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
