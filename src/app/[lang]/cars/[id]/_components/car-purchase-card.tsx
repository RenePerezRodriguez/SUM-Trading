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
    <div className="border-2 border-dashed border-primary/30 bg-secondary/10 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] font-mono px-2 py-1 rounded-bl-sm">
        REF: {car.id.slice(0, 8).toUpperCase()}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 border-b border-border/60 pb-4">
        <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Estado del Lote</p>
            <Badge 
                variant={carStatus === 'Sold' ? 'destructive' : carStatus === 'Reserved' ? 'secondary' : 'default'}
                className={cn('text-sm font-bold rounded-sm px-3 py-1', carStatus === 'Available' && 'bg-primary text-primary-foreground')}
            >
                {statusLabel}
            </Badge>
        </div>
        <div className="text-left sm:text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{dict.car_details.price}</p>
            <p className="text-3xl md:text-4xl font-black text-primary font-headline tracking-tighter">
            {formattedPrice}
            </p>
        </div>
      </div>

        <div className="flex flex-col gap-3">
            <Button 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg h-14 font-bold uppercase tracking-wide rounded-sm shadow-sm" 
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
                    Me Interesa / Ofertar
                </>
                )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
                Al hacer clic, este vehículo se añadirá a tu lista de seguimiento.
            </p>
        </div>
    </div>
  );
}
