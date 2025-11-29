'use client';

import Link from 'next/link';
import type { Car } from '@/lib/placeholder-data';
import { Wrench, Gauge, Waypoints, Cog, Tag, ShieldQuestion, FileText, Heart } from 'lucide-react';
import SpecItem from '@/components/sections/spec-item';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import useSumConsultationStore from '@/hooks/use-sum-consultation-store';
import useAuthModalStore from '@/hooks/use-auth-modal-store';
import { useUser } from '@/firebase';


type CarListItemDetailsProps = {
  car: Car;
  lang: string;
  dict: any;
};

const HorizontalSpecItem = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string | number, label: string }) => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground" title={label}>
        <Icon className="w-4 h-4" />
        <span className="font-medium text-foreground">{value}</span>
    </div>
);


export default function CarListItemDetails({ car, lang, dict }: CarListItemDetailsProps) {
  const { addItem: addSumItem } = useSumConsultationStore();
  const { toast } = useToast();
  const { user } = useUser();
  const { openModal } = useAuthModalStore();
  const t_bar = dict.sum_consultation_bar;

  const formattedMileage = new Intl.NumberFormat(lang).format(car.mileage);
  const statusKey = car.status.toLowerCase();
  const statusLabel = dict.status_types?.[statusKey] || car.status;
  const statusVariant: "default" | "secondary" | "destructive" = {
    available: 'default' as const,
    reserved: 'secondary' as const,
    sold: 'destructive' as const
  }[statusKey] || 'default' as const;
  const statusColorClass = statusKey === 'available' ? 'bg-primary text-primary-foreground' : '';

  const t = dict.add_vehicle_page.fields;
  const finalTitleType = t.titleType_types[car.titleType.replace(/\s+/g, '_').toLowerCase() as keyof typeof t.titleType_types] || car.titleType;
  const translatedEngineStatus = t.engineStatus_types[car.engineStatus.replace(/\s+/g, '_').toLowerCase() as keyof typeof t.engineStatus_types] || car.engineStatus;
  const finalPrimaryDamage = t.primaryDamage_types[car.primaryDamage.replace(/[\s/]+/g, '_').toLowerCase() as keyof typeof t.primaryDamage_types] || car.primaryDamage;

  return (
    <div className="flex-grow">
      <Link href={`/${lang}/cars/${car.id}`} className="block">
        <h3 className="text-xl font-bold font-headline group-hover:text-primary transition-colors">{car.make} {car.model}</h3>
      </Link>
      <p className="text-sm text-muted-foreground capitalize">{car.type === 'Other' ? car.otherType : car.type}</p>
      <p className="text-sm text-muted-foreground mb-4 mt-1">{car.description.substring(0, 120)}...</p>

      <div className="flex flex-wrap gap-x-4 gap-y-2 my-4">
          <HorizontalSpecItem icon={Waypoints} value={`${formattedMileage} mi`} label={dict.car_details.mileage} />
          <HorizontalSpecItem icon={Gauge} value={`${car.horsepower} hp`} label={dict.car_details.horsepower} />
          <HorizontalSpecItem icon={Cog} value={dict.add_vehicle_page.fields.transmission_types[car.transmission.toLowerCase() as keyof typeof dict.add_vehicle_page.fields.transmission_types]} label={dict.car_details.transmission} />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="w-4 h-4" />
                <Badge variant={statusVariant} className={cn(statusColorClass)}>{statusLabel}</Badge>
          </div>
      </div>
       <div className="grid grid-cols-2 gap-4 text-left border-t pt-4 items-start">
          <SpecItem
            icon={FileText}
            label={t.titleType}
            value={finalTitleType}
          />
          <SpecItem
            icon={ShieldQuestion}
            label={t.primaryDamage}
            value={finalPrimaryDamage}
          />
          <SpecItem
            icon={Wrench}
            label={t.engineStatus}
            value={translatedEngineStatus}
          />
      </div>
    </div>
  );
}
