
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge, Wrench, Palette, Cog, Waypoints, FileText, KeyRound, AlertTriangle, ShieldQuestion, Fingerprint, Calendar, Car as CarIcon, Fuel, GitCommit, Hash, CircleDollarSign, Sparkles, MapPin } from 'lucide-react';
import type { Car } from '@/lib/placeholder-data';
import type { Locale } from '@/lib/i18n-config';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type CarSpecificationsProps = {
  car: Car;
  dict: any;
  lang: Locale;
};

const SpecificationItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | React.ReactNode }) => (
    <div className="flex flex-col p-4 border border-border/40 bg-background hover:bg-secondary/10 transition-colors">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <Icon className="w-4 h-4 flex-shrink-0"/>
        <span className="text-xs uppercase tracking-wider font-medium">{label}</span>
      </div>
      <div className="font-mono text-sm md:text-base font-semibold text-foreground break-words whitespace-normal">
        {value || '-'}
      </div>
    </div>
  );

export default function CarSpecifications({ car, dict, lang }: CarSpecificationsProps) {
  const formattedMileage = new Intl.NumberFormat(lang).format(car.mileage);
  const formattedRetailValue = car.estimatedRetailValue ? new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(car.estimatedRetailValue) : null;

  const t = dict.add_vehicle_page.fields;

  let finalType: string = car.type;
  if (car.type === 'Other') {
    finalType = car.otherType || 'Other';
  }

  let finalTitleType: string = car.titleType;
  if (car.titleType === 'Other') {
    finalTitleType = car.otherTitleType || 'Other';
  } else {
    finalTitleType = t.titleType_types[car.titleType.replaceAll(' ', '_').toLowerCase() as keyof typeof t.titleType_types] || car.titleType;
  }
  const titleTypeVariant = car.titleType === 'Clean Title' ? 'default' : car.titleType.includes('Salvage') ? 'destructive' : 'secondary';
  
  const translatedEngineStatus = t.engineStatus_types[car.engineStatus.replaceAll(' ', '_').toLowerCase() as keyof typeof t.engineStatus_types] || car.engineStatus;
  const engineStatusVariant = car.engineStatus === 'Runs and Drives' ? 'default' : car.engineStatus === 'Starts' ? 'secondary' : 'destructive';

  let finalPrimaryDamage: string = car.primaryDamage;
  if (car.primaryDamage === 'Other') {
    finalPrimaryDamage = car.otherPrimaryDamage || 'Other';
  } else {
    finalPrimaryDamage = t.primaryDamage_types[car.primaryDamage.replaceAll('/', '_').replaceAll(' ', '_').toLowerCase() as keyof typeof t.primaryDamage_types] || car.primaryDamage;
  }
  
  let finalSecondaryDamage: string | undefined = car.secondaryDamage;
  if (finalSecondaryDamage) {
    finalSecondaryDamage = t.primaryDamage_types[finalSecondaryDamage.replaceAll('/', '_').replaceAll(' ', '_').toLowerCase() as keyof typeof t.primaryDamage_types] || finalSecondaryDamage;
  }


  const specifications = [
    { label: t.lotNumber, value: car.lotNumber, icon: Hash },
    { label: t.vin, value: car.vin, icon: Fingerprint },
    { label: dict.car_details.year, value: car.year, icon: Calendar },
    { label: 'Procedencia', value: `${car.provenance.city}, ${car.provenance.country}`, icon: MapPin },
    { label: dict.car_details.mileage, value: `${formattedMileage} ${car.mileageUnit}`, icon: Waypoints },
    { label: dict.car_details.engine, value: car.engine, icon: Wrench },
    { label: t.cylinders, value: car.cylinders, icon: GitCommit },
    { label: dict.car_details.horsepower, value: `${car.horsepower} hp`, icon: Gauge },
    { label: dict.car_details.transmission, value: t.transmission_types[car.transmission.toLowerCase() as keyof typeof t.transmission_types], icon: Cog },
    { label: t.drive, value: car.drive, icon: Cog },
    { label: t.fuel, value: car.fuel, icon: Fuel },
    { label: dict.car_details.color, value: car.color, icon: Palette },
    { label: t.type, value: finalType, icon: CarIcon },
    { 
        label: t.titleCode,
        value: car.titleCode,
        icon: FileText
    },
    { 
        label: t.titleType, 
        value: <Badge variant={titleTypeVariant}>{finalTitleType}</Badge>, 
        icon: FileText
    },
    { 
        label: t.hasKeys, 
        value: <Badge variant={car.hasKeys ? 'default' : 'secondary'}>{car.hasKeys ? dict.car_details.yes : dict.car_details.no}</Badge>, 
        icon: KeyRound
    },
    { 
        label: t.engineStatus, 
        value: <Badge variant={engineStatusVariant}>{translatedEngineStatus}</Badge>, 
        icon: Wrench
    },
    { 
        label: t.primaryDamage, 
        value: finalPrimaryDamage, 
        icon: ShieldQuestion
    },
    { 
        label: t.secondaryDamage, 
        value: finalSecondaryDamage, 
        icon: ShieldQuestion
    },
    {
      label: t.estimatedRetailValue,
      value: formattedRetailValue,
      icon: CircleDollarSign
    },
    {
        label: t.highlights,
        value: car.highlights,
        icon: Sparkles
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold font-headline uppercase tracking-tight">Ficha Técnica</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border/50 border border-border/50 overflow-hidden rounded-sm">
        {specifications.map((spec, index) => (
           spec.value && <SpecificationItem key={index} icon={spec.icon} label={spec.label} value={spec.value} />
        ))}
         {car.damageDescription && (
            <div className="col-span-2 md:col-span-3 lg:col-span-4">
              <SpecificationItem 
                  icon={AlertTriangle} 
                  label={t.damageDescription} 
                  value={<span className='text-destructive font-normal'>{car.damageDescription}</span>} 
              />
            </div>
        )}
      </div>
    </div>
  );
}
