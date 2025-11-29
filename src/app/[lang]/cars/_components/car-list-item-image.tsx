
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Car } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { Heart, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import useFavoriteStore, { useFavoriteSync } from '@/hooks/use-favorite-store';
import useCompareStore from '@/hooks/use-compare-store';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore } from '@/firebase';
import useAuthModalStore from '@/hooks/use-auth-modal-store';

type CarListItemImageProps = {
  car: Car;
  lang: string;
  dict: any;
};

export default function CarListItemImage({ car, lang, dict }: CarListItemImageProps) {
  useFavoriteSync(); // Ensures state is synced with Firestore
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const { openModal } = useAuthModalStore();

  const { isFavorite, toggleFavorite, isLoading } = useFavoriteStore();
  const { isComparing, toggleCompare } = useCompareStore();
  
  const favorite = isFavorite(car.id);
  const comparing = isComparing(car.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
        openModal('login');
        return;
    }

    toggleFavorite(car.id, user?.uid || null, firestore);
    
    toast({
      title: !favorite ? dict.car_catalog.added_to_favorites : dict.car_catalog.removed_from_favorites,
      description: `${car.make} ${car.model}`,
    });
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const mainImage = car.images && car.images.length > 0 ? car.images[0] : null;
    toggleCompare({
        id: car.id,
        make: car.make,
        model: car.model,
        image: mainImage,
    });
    toast({
      title: !comparing ? dict.car_catalog.add_to_compare : dict.car_catalog.remove_from_compare,
      description: `${car.make} ${car.model}`,
    });
  };
  
  const mainImage = car.images && car.images.length > 0 ? car.images[0] : null;

  return (
    <div className="md:col-span-1 relative">
      <div className="aspect-[4/3] w-full relative overflow-hidden">
        <Link href={`/${lang}/cars/${car.id}`} className="block w-full h-full">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
              data-ai-hint={mainImage.hint}
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
                Sin imagen
            </div>
          )}
        </Link>
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full bg-background/70 hover:bg-background"
            onClick={handleToggleFavorite}
            aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            disabled={isLoading}
          >
            <motion.div whileTap={{ scale: 1.3 }}>
              <Heart className={cn("h-5 w-5", favorite && 'fill-red-500 text-red-500')} />
            </motion.div>
          </Button>
          <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full bg-background/70 hover:bg-background"
                onClick={handleToggleCompare}
                aria-label={comparing ? "Quitar de la comparación" : "Añadir a la comparación"}
            >
                <motion.div whileTap={{ scale: 1.3 }}>
                    <Scale className={cn("h-5 w-5", comparing && 'text-primary')} />
                </motion.div>
            </Button>
        </div>
        <Badge variant="secondary" className="absolute top-3 left-3 z-10">{car.year}</Badge>
      </div>
    </div>
  );
}
