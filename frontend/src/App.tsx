import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import Admin from "./pages/Admin";
import MoviePlayer from "./pages/MoviePlayer";
import SeriesPlayer from "./pages/SeriesPlayer";
import NotFound from "./pages/NotFound";
import { MoviesProvider } from "./store/movies";
import useSettingsStore from "./store/settings";

const queryClient = new QueryClient();

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

// Settings initializer component
const SettingsInitializer = () => {
  const { initialize } = useSettingsStore();
  
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MoviesProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <SettingsInitializer />
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/movie/:id" element={<MoviePlayer />} />
          <Route path="/series/:id" element={<SeriesPlayer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </MoviesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
