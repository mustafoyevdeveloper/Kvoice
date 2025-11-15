export const MovieCardSkeleton = () => {
  return (
    <div className="movie-card rounded-lg overflow-hidden animate-pulse">
      {/* Poster Skeleton */}
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        <div className="w-full h-full bg-gradient-to-br from-muted via-muted/50 to-muted" />
        
        {/* Quality badges skeleton */}
        <div className="absolute top-1 md:top-2 left-1 md:left-2 flex flex-col gap-1">
          <div className="h-4 w-10 bg-muted-foreground/20 rounded animate-pulse" />
          <div className="h-4 w-10 bg-muted-foreground/20 rounded animate-pulse" />
        </div>

        {/* Rating skeleton */}
        <div className="absolute bottom-1 md:bottom-2 left-1 md:left-2 flex items-center space-x-1 bg-black/30 backdrop-blur-sm rounded px-2 py-1">
          <div className="h-3 w-3 bg-muted-foreground/30 rounded-full" />
          <div className="h-3 w-6 bg-muted-foreground/30 rounded" />
        </div>
      </div>

      {/* Info Skeleton */}
      <div className="p-2 md:p-3 space-y-2">
        {/* Title skeleton */}
        <div className="space-y-1">
          <div className="h-3 md:h-4 bg-muted-foreground/20 rounded w-3/4" />
          <div className="h-3 md:h-4 bg-muted-foreground/20 rounded w-1/2" />
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-1">
          <div className="h-2 md:h-3 bg-muted-foreground/10 rounded w-full" />
          <div className="h-2 md:h-3 bg-muted-foreground/10 rounded w-5/6" />
        </div>
        
        {/* Meta info skeleton */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="h-3 w-10 bg-muted-foreground/10 rounded" />
          <div className="h-3 w-10 bg-muted-foreground/10 rounded" />
          <div className="h-3 w-10 bg-muted-foreground/10 rounded" />
        </div>
      </div>
    </div>
  );
};

