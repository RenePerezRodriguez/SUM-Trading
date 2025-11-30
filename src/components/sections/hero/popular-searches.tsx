'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Locale } from '@/lib/i18n-config';

interface PopularSearch {
  query: string;
  searchCount: number;
  lastUpdated: any;
}

interface PopularSearchesProps {
  lang: Locale;
  dict: any;
}

export function PopularSearches({ lang, dict }: PopularSearchesProps) {
  const [searches, setSearches] = useState<PopularSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPopularSearches = async () => {
      try {
        const response = await fetch('/api/popular-searches?limit=8');
        const data = await response.json();
        
        if (data.success && data.searches) {
          setSearches(data.searches);
        }
      } catch (error) {
        console.error('Error fetching popular searches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularSearches();
  }, []);

  const handleSearchClick = (query: string) => {
    // Redirect to search page with limit=10 (fast results from cache)
    router.push(`/${lang}/search?query=${encodeURIComponent(query)}&page=1&limit=10`);
  };

  if (isLoading) {
    return (
      <div className="mt-6 animate-in fade-in-50 duration-500">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-medium">
            {dict.hero?.popular_searches || 'Búsquedas populares'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
        </div>
      </div>
    );
  }

  if (searches.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="text-sm text-muted-foreground font-medium">
          {dict.hero?.popular_searches || 'Búsquedas populares'}
        </span>
        <div className="hidden sm:flex items-center gap-1 ml-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
            {dict.hero?.instant_results || 'Resultados instantáneos'}
            </span>
        </div>
      </div>
      
      {/* Mobile: Horizontal Scroll | Desktop: Wrap */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap gap-2 scrollbar-none snap-x">
        {searches.map((search) => (
          <button
            key={search.query}
            onClick={() => handleSearchClick(search.query)}
            className="group flex-shrink-0 snap-start"
          >
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 text-sm px-3 py-1.5 capitalize whitespace-nowrap"
            >
              {search.query}
              {search.searchCount > 1 && (
                <span className="ml-1.5 text-xs opacity-60 group-hover:opacity-100">
                  ({search.searchCount})
                </span>
              )}
            </Badge>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        {dict.hero?.cached_results || 'Estas búsquedas tienen resultados al instante'}
      </p>
      
      <style jsx global>{`
        .scrollbar-none {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .scrollbar-none::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </div>
  );
}
