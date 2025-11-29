'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, XCircle, MessageSquarePlus, Heart } from 'lucide-react';
import type { Car } from '@/lib/placeholder-data';
import type { Locale } from '@/lib/i18n-config';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import useCopartConsultationStore from '@/hooks/use-copart-consultation-store';
import useSumConsultationStore from '@/hooks/use-sum-consultation-store';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';
import { useUser } from '@/firebase';
import useAuthModalStore from '@/hooks/use-auth-modal-store';

type CarPurchaseCardProps = {
  car: Car;
  dict: any;
  lang: Locale;
};

export default function CarPurchaseCard({ car, dict, lang }: CarPurchaseCardProps) {
  const { addItem: addSumItem } = useSumConsultationStore();
  const { toast } = useToast();
  const { user } = useUser();
  const { openModal } = useAuthModalStore();
  const isAvailable = car.status === 'Available';
  
  const t_bar = dict.sum_consultation_bar;

  const formattedPrice = new Intl.NumberFormat(lang, { 
    style: 'currency', 
    currency: 'USD', 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  }).format(car.price);
  
   const handleAddToInterestList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      openModal('login');
      return;
    }

    addSumItem(car);
    toast({
        title: t_bar.added_title,
        description: `${car.make} ${car.model} ${t_bar.added_desc}`,
    });
  };


  const carStatus = car.status || 'Available';
  const statusLabel = dict.status_types[carStatus.toLowerCase() as keyof typeof dict.status_types] || carStatus;

  return (
    <>
      <div className="flex justify-between items-center bg-secondary p-4 rounded-lg mb-4">
        <div>
            <p className="text-muted-foreground text-sm">Estado</p>
            <Badge 
                variant={carStatus === 'Sold' ? 'destructive' : carStatus === 'Reserved' ? 'secondary' : 'default'}
                className={cn('text-base', carStatus === 'Available' && 'bg-primary text-primary-foreground')}
            >
                {statusLabel}
            </Badge>
        </div>
        <div>
            <p className="text-muted-foreground text-sm text-right">{dict.car_details.price}</p>
            <p className="text-3xl font-bold text-primary text-right">
            {formattedPrice}
            </p>
        </div>
      </div>

        <div className="flex flex-col gap-2">
            <Button 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-7 font-bold" 
                onClick={handleAddToInterestList}
                disabled={!isAvailable}
            >
              {!isAvailable ? (
                    <>
                        <XCircle className="mr-2 h-5 w-5" />
                        No disponible
                    </>
                ) : (
                <>
                    <Heart className="mr-2 h-5 w-5" />
                    Me Interesa
                </>
                )}
            </Button>
        </div>
    </>
  );
}
