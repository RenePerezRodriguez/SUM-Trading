
'use client';
import type { Locale } from '@/lib/i18n-config';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import VehicleForm from '../../_components/vehicle-form';
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { Car } from '@/lib/placeholder-data';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditVehicleClient({ lang, id, dict }: { lang: Locale, id: string, dict: any }) {

  const firestore = useFirestore();
  
  const carDocRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'cars', id);
  }, [firestore, id]);

  const { data: car, isLoading, error } = useDoc<Car>(carDocRef);
  
  if (isLoading || !dict) {
    return (
        <div className="container py-12">
            <PageHeader title="..." description="..." />
            <div className="max-w-4xl mx-auto space-y-6">
                <Skeleton className="h-10 w-36" />
                <Card className="p-6 space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-24 w-full" />
                    <div className="flex justify-end">
                        <Skeleton className="h-10 w-24" />
                    </div>
                </Card>
            </div>
        </div>
    );
  }

  if (error) {
    throw error;
  }
  
  if (!car) {
    return (
        <div className="container py-12 text-center">
            <PageHeader title={dict.edit_vehicle_page.not_found_title} description={dict.edit_vehicle_page.not_found_desc} />
            <Button asChild>
                <Link href={`/${lang}/admin/vehicles`}>{dict.add_vehicle_page.back_button}</Link>
            </Button>
        </div>
    )
  }

  const content = dict.add_vehicle_page;
  const editContent = dict.edit_vehicle_page;
  
  return (
    <div className="container py-12">
      <PageHeader 
        title={editContent.title}
        description={editContent.description}
      />
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
            <Button asChild variant="outline">
              <Link href={`/${lang}/admin/vehicles`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {content.back_button}
              </Link>
            </Button>
        </div>
        <Card className="p-4 sm:p-6">
            <VehicleForm lang={lang} dict={dict} existingVehicle={car} />
        </Card>
      </div>
    </div>
  );
}
