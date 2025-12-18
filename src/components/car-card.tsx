'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Car } from '@/lib/placeholder-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Gauge, Waypoints, Cog, Scale, FileText, Wrench, ShieldQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import useFavoriteStore, { useFavoriteSync } from '@/hooks/use-favorite-store';
import useCompareStore from '@/hooks/use-compare-store';
import { motion } from 'framer-motion';
import { useUser, useFirestore } from '@/firebase';
import useAuthModalStore from '@/hooks/use-auth-modal-store';
import SpecItem from './sections/spec-item';

type CarCardProps = {
  car: Car;
  lang: string;
  dict?: any;
};

const HorizontalSpecItem = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string | number, label: string }) => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground" title={label}>
    <Icon className="w-4 h-4" />
    <span className="font-medium text-foreground">{value}</span>
  </div>
);


export function CarCard({ car, lang, dict }: CarCardProps) {
  useFavoriteSync();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const { openModal } = useAuthModalStore();
  const t = dict.car_card;

  const formattedPrice = new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD', notation: 'compact', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(car.price);
  const { isFavorite, toggleFavorite, isLoading: isFavoritesLoading } = useFavoriteStore();
  const { isComparing, toggleCompare } = useCompareStore();

  const favorite = isFavorite(car.id);
  const comparing = isComparing(car.id);

  const [clientState, setClientState] = useState<{ viewCount: string | null }>({ viewCount: null });

  useEffect(() => {
    setClientState({
      viewCount: (Math.random() * 2 + 0.5).toFixed(1) + 'k',
    });
  }, [car.id]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openModal('login');
      return;
    }

    toggleFavorite(car.id, user?.uid || null, firestore);

    const toastTitle = !favorite ? (dict?.car_catalog?.added_to_favorites || 'Added to favorites') : (dict?.car_catalog?.removed_from_favorites || 'Removed from favorites');
    toast({
      title: toastTitle,
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
    const addMessage = dict?.car_catalog?.add_to_compare || "Add to comparison";
    const removeMessage = dict?.car_catalog?.remove_from_compare || "Remove from comparison";
    toast({
      title: !comparing ? addMessage : removeMessage,
      description: `${car.make} ${car.model}`,
    });
  };

  const formattedMileage = new Intl.NumberFormat(lang, { notation: 'compact', maximumFractionDigits: 1 }).format(car.mileage);

  const statusKey = car.status.toLowerCase();
  const statusLabel = dict.status_types?.[statusKey] || car.status;
  const statusVariant: "default" | "secondary" | "destructive" = {
    available: 'default' as const,
    reserved: 'secondary' as const,
    sold: 'destructive' as const
  }[statusKey] || 'default' as const;
  const statusColorClass = statusKey === 'available' ? 'bg-primary text-primary-foreground' : '';

  const mainImage = car.images && car.images.length > 0 ? car.images[0] : null;

  const fields_dict = dict.add_vehicle_page.fields;
  const transmissionText = fields_dict.transmission_types[car.transmission.toLowerCase() as keyof typeof fields_dict.transmission_types] || car.transmission;
  const finalTitleType = fields_dict.titleType_types[car.titleType.replace(/\s+/g, '_').toLowerCase() as keyof typeof fields_dict.titleType_types] || car.titleType;
  const translatedEngineStatus = fields_dict.engineStatus_types[car.engineStatus.replace(/\s+/g, '_').toLowerCase() as keyof typeof fields_dict.engineStatus_types] || car.engineStatus;
  const finalPrimaryDamage = fields_dict.primaryDamage_types[car.primaryDamage.replace(/[\s/]+/g, '_').toLowerCase() as keyof typeof fields_dict.primaryDamage_types] || car.primaryDamage;

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl active:scale-[0.99] border-gradient group w-full h-full">
      <div className="relative">
        <Link href={`/${lang}/cars/${car.id}`} className="block w-full">
          <div className="aspect-[4/3] w-full relative overflow-hidden">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={mainImage.hint}
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
                {t.no_image}
              </div>
            )}
          </div>
        </Link>
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex flex-col gap-1.5 sm:gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all hover:scale-110"
            onClick={handleToggleFavorite}
            aria-label={favorite ? t.remove_from_favorites_aria : t.add_to_favorites_aria}
            disabled={isFavoritesLoading}
          >
            <motion.div whileTap={{ scale: 1.3 }}>
              <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", favorite && 'fill-red-500 text-red-500')} />
            </motion.div>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all hover:scale-110"
            onClick={handleToggleCompare}
            aria-label={comparing ? t.remove_from_comparison_aria : t.add_to_comparison_aria}
          >
            <motion.div whileTap={{ scale: 1.3 }}>
              <Scale className={cn("h-5 w-5", comparing && 'text-primary')} />
            </motion.div>
          </Button>
        </div>
        <Badge variant="secondary" className="absolute top-3 left-3 z-10">{car.year}</Badge>

        {/* Highlight Badges */}
        <div className="absolute bottom-2 left-2 z-10 flex flex-col gap-1">
          {car.engineStatus === 'Runs and Drives' && (
            <Badge className="bg-green-600 hover:bg-green-700 text-white border-none shadow-sm">
              Run & Drive
            </Badge>
          )}
          {car.titleType === 'Clean Title' && (
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm">
              Clean Title
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-3 flex-grow flex flex-col">
        <div className="flex-grow">
          <Link href={`/${lang}/cars/${car.id}`} className="block">
            <h3 className="text-base sm:text-lg font-bold font-headline group-hover:text-primary transition-colors line-clamp-2">{car.make} {car.model}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1 capitalize">{car.type === 'Other' ? car.otherType : car.type}</p>
        </div>

        <div className="border-t my-3 py-3 grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-2 text-center">
          <HorizontalSpecItem icon={Waypoints} value={`${formattedMileage} mi`} label={dict?.car_details?.mileage || 'Mileage'} />
          <HorizontalSpecItem icon={Gauge} value={`${car.horsepower} hp`} label={dict?.car_details?.horsepower || 'Horsepower'} />
          <HorizontalSpecItem icon={Cog} value={transmissionText} label={dict?.car_details?.transmission || 'Transmission'} />
        </div>

        <div className="grid grid-cols-1 gap-3 text-left border-t pt-3">
          <SpecItem
            icon={FileText}
            label={fields_dict.titleType}
            value={finalTitleType}
          />
          <SpecItem
            icon={ShieldQuestion}
            label={fields_dict.primaryDamage}
            value={finalPrimaryDamage}
          />
          <SpecItem
            icon={Wrench}
            label={fields_dict.engineStatus}
            value={translatedEngineStatus}
          />
        </div>

        <div className="flex justify-between items-center mt-auto pt-4">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-primary">
              {formattedPrice}
            </p>
            <Badge variant={statusVariant} className={cn('mt-1', statusColorClass)}>{statusLabel}</Badge>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>{clientState.viewCount || '...'}</span>
            <span className="sr-only">{t.views}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
