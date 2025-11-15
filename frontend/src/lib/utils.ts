import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a poster URL to a full URL if it's an API endpoint
 * Handles MongoDB stored posters that are accessed via /api/movies/:id/poster
 */
export function getPosterUrl(posterUrl: string | undefined | null): string {
  if (!posterUrl) {
    return '/placeholder-poster.jpg';
  }

  // If it's a base64 string, use it directly
  if (posterUrl.startsWith('data:image')) {
    return posterUrl;
  }

  // If it's already a full URL, use as is
  if (posterUrl.startsWith('http://') || posterUrl.startsWith('https://')) {
    return posterUrl;
  }

  // If it's an API endpoint (MongoDB stored poster), prepend base URL
  if (posterUrl.startsWith('/api/movies/') || posterUrl.includes('/poster')) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 
                   import.meta.env.VITE_BACKEND_URL || 
                   import.meta.env.VITE_API_URL?.replace('/api', '') || 
                   'http://localhost:3000';
    
    // Ensure it's the full poster endpoint
    if (posterUrl.startsWith('/api/movies/') && !posterUrl.endsWith('/poster')) {
      // Extract movie ID and create poster endpoint
      const movieId = posterUrl.split('/').filter(p => p).pop()?.split('?')[0];
      if (movieId) {
        return `${baseUrl}/api/movies/${movieId}/poster`;
      } else {
        return `${baseUrl}${posterUrl}`;
      }
    } else {
      return `${baseUrl}${posterUrl}`;
    }
  }

  // Default fallback
  return posterUrl;
}
