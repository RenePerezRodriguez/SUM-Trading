'use client';

import Image from 'next/image';
import type { Car } from '@/lib/placeholder-data';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

type CarImageProps = {
  car: Car;
};

export default function CarImage({ car }: CarImageProps) {
  const [mainImage, setMainImage] = useState(car.images[0]);

  if (!car.images || car.images.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl bg-secondary flex items-center justify-center">
        <p className="text-muted-foreground">Sin imagen</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={mainImage.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl"
        >
          <Image
            src={mainImage.url}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            data-ai-hint={mainImage.hint}
          />
        </motion.div>
      </AnimatePresence>
      
      {car.images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {car.images.map((image) => (
            <button
              key={image.id}
              onClick={() => setMainImage(image)}
              className={cn(
                "relative aspect-square w-full overflow-hidden rounded-md transition-all duration-200 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                image.id === mainImage.id ? 'ring-2 ring-primary' : 'hover:opacity-80'
              )}
            >
              <Image
                src={image.url}
                alt={`Thumbnail for ${car.make} ${car.model}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
