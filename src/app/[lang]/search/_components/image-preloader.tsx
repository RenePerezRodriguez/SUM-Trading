'use client';

import { useEffect } from 'react';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';

interface ImagePreloaderProps {
  vehicles: NormalizedVehicle[];
  pageNumber: number;
}

/**
 * Preload images for vehicles on current page and next page
 * This prevents slow image loading when navigating between pages
 */
export function ImagePreloader({ vehicles, pageNumber }: ImagePreloaderProps) {
  useEffect(() => {
    // Preload images for current page vehicles
    vehicles.forEach((vehicle) => {
      if (vehicle.imageUrl) {
        const img = new Image();
        img.src = vehicle.imageUrl;
        // Optional: log for debugging
        // console.log(`[Preload] Page ${pageNumber}, Image: ${vehicle.imageUrl.substring(0, 50)}...`);
      }
    });
  }, [vehicles, pageNumber]);

  return null; // Component doesn't render anything
}
