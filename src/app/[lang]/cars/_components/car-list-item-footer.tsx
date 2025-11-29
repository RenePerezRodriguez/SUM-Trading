'use client';

import Link from 'next/link';
import type { Car } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart } from 'lucide-react';
import useSumConsultationStore from '@/hooks/use-sum-consultation-store';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import useAuthModalStore from '@/hooks/use-auth-modal-store';

type CarListItemFooterProps = {
  car: Car;
  lang: string;
  dict: any;
};

export default function CarListItemFooter({ car, lang, dict }: CarListItemFooterProps) {
    const { addItem: addSumItem } = useSumConsultationStore();
    const { toast } = useToast();
    const { user } = useUser();
    const { openModal } = useAuthModalStore();
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
            openModal('login');
            return;
        }

        addSumItem(car);
        toast({
            title: t_bar.added_title,
            description: `${car.make} ${car.model} ${t_bar.added_desc}`,
        });
    };


    return (
        <div className="flex items-end justify-between border-t pt-4">
            <div>
                <p className="text-xs text-muted-foreground">{dict.car_details.price}</p>
                <p className="text-2xl font-bold text-primary">{formattedPrice}</p>
            </div>
            <div className="flex items-center gap-2">
                 <Button onClick={handleAddToInterestList} size="sm" variant="outline">
                    <Heart className="mr-2 h-4 w-4" />
                    Me interesa
                </Button>
                <Button asChild size="sm">
                    <Link href={`/${lang}/cars/${car.id}`}>
                        {dict.car_catalog.view_details}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
