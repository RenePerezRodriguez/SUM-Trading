
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { Car, CarImage } from '@/lib/placeholder-data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type CompareItem = {
    id: string;
    make: string;
    model: string;
    image: CarImage | null;
}

type ComparisonCarListProps = {
  compareItems: CompareItem[];
  toggleCompare: (car: CompareItem) => void;
  dict: any;
};

const CarImageItem = ({ car, onRemove, dict }: { car: CompareItem, onRemove: () => void, dict: any }) => {
  const tooltipText = `${dict.car_catalog.remove_from_compare} ${car.make}`;

  const content = (
      <motion.div
        layout
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="relative flex-shrink-0 cursor-pointer group"
      >
        {car.image ? (
            <Image
            src={car.image.url}
            alt={car.make}
            width={64}
            height={48}
            className="rounded-md object-cover h-12 w-16 transition-all"
            data-ai-hint={car.image.hint}
            />
        ) : (
            <div className="h-12 w-16 rounded-md bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                No Img
            </div>
        )}
        <Button
          size="icon"
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          aria-label={tooltipText}
        >
          <X className="h-3 w-3" />
        </Button>
      </motion.div>
  );

  return (
    <TooltipProvider delayDuration={200}>
        <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
};


export default function ComparisonCarList({ compareItems, toggleCompare, dict }: ComparisonCarListProps) {
  return (
    <div className="flex items-center gap-2">
      <AnimatePresence>
        {compareItems.map(car => (
          <CarImageItem
            key={`comp-${car.id}`}
            car={car}
            onRemove={() => toggleCompare(car)}
            dict={dict}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
