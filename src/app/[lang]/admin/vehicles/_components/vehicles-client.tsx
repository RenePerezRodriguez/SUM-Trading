
'use client';

import { collection, doc } from 'firebase/firestore';
import { useCollection, useFirestore, useStorage, useMemoFirebase, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import type { Car } from '@/lib/placeholder-data';
import { DataTable } from '@/app/admin/components/data-table';
import { columns } from './vehicles-table/columns';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteObject, ref } from 'firebase/storage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function VehiclesClient({ dict, lang }: { dict: any; lang: string }) {
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const t = dict.admin_vehicles_page;
  
  const carsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'cars');
  }, [firestore]);

  const { data: cars, isLoading, error } = useCollection<Car>(carsCollection);
  
  const [carsToDelete, setCarsToDelete] = useState<Car[]>([]);

  const deleteVehicleAndFiles = async (vehicle: Car) => {
    if (!firestore || !storage) {
        throw new Error(t.firebase_not_available);
    }

    const carDocRef = doc(firestore, 'cars', vehicle.id);
    await deleteDocumentNonBlocking(carDocRef);

    const deletePromises: Promise<void>[] = [];
    if (vehicle.images && vehicle.images.length > 0) {
        vehicle.images.forEach(image => {
            if (image.id) {
                const imageRef = ref(storage, `cars/${image.id}`);
                deletePromises.push(deleteObject(imageRef).catch(e => console.warn(`Could not delete image ${image.id}:`, e)));
            }
        });
    }
    if (vehicle.video?.id) {
        const videoRef = ref(storage, `cars/${vehicle.video.id}`);
        deletePromises.push(deleteObject(videoRef).catch(e => console.warn("Could not delete old video", e)));
    }
    
    await Promise.all(deletePromises);
  };
  
  const handleDeleteVehicles = async () => {
    if (carsToDelete.length === 0) return;

    const deletePromises = carsToDelete.map(car => deleteVehicleAndFiles(car));
    
    try {
        await Promise.all(deletePromises);
        toast({
            title: carsToDelete.length > 1 ? t.delete_success_title_many : t.delete_success_title_one,
            description: t.delete_success_desc.replace('{count}', carsToDelete.length.toString()),
        });
    } catch (e: any) {
        toast({
            variant: "destructive",
            title: dict.delete_vehicle_dialog.delete_error_title,
            description: e.message || dict.delete_vehicle_dialog.delete_error_desc,
        });
    } finally {
        setCarsToDelete([]);
    }
  };


  const handleStatusChange = async (car: Car, newStatus: 'Available' | 'Reserved' | 'Sold') => {
    if (!firestore) return;
    const carDocRef = doc(firestore, 'cars', car.id);
    try {
      await updateDocumentNonBlocking(carDocRef, { status: newStatus });
      toast({
          title: t.status_update_success_title,
          description: t.status_update_success_desc.replace('{make}', car.make).replace('{model}', car.model).replace('{status}', newStatus),
      });
    } catch(e) {
        toast({
            variant: "destructive",
            title: t.status_update_error_title,
            description: t.status_update_error_desc,
        });
    }
  };

  const tableColumns = columns({ dict, onDelete: (car) => setCarsToDelete([car]), onStatusChange: handleStatusChange });

  if (isLoading) {
    return (
        <div className="container py-12">
            <PageHeader title={dict.admin_page.actions.manage_vehicles.title} description={dict.admin_page.actions.manage_vehicles.description} />
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    );
  }

  if (error) {
    throw error;
  }
  
  return (
    <>
      <div className="container py-12">
        <PageHeader title={dict.admin_page.actions.manage_vehicles.title} description={dict.admin_page.actions.manage_vehicles.description} />
        <div className="mb-6 flex justify-between items-center">
          <Button asChild variant="outline">
            <Link href={`/${lang}/admin`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.back_to_panel}
            </Link>
          </Button>
          <Button asChild>
              <Link href={`/${lang}/admin/vehicles/new`}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t.add_vehicle}
              </Link>
          </Button>
        </div>
        <DataTable 
            columns={tableColumns} 
            data={cars || []} 
            filterColumnId='make'
            filterPlaceholder={t.filter_placeholder}
            dict={dict}
        >
            {(table: any) => {
                const numSelected = table.getFilteredSelectedRowModel().rows.length;
                if (numSelected === 0) return null;
                return (
                    <Button
                        variant="destructive"
                        className="ml-2"
                        onClick={() => setCarsToDelete(table.getFilteredSelectedRowModel().rows.map((row: any) => row.original))}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t.delete_button} ({numSelected})
                    </Button>
                );
            }}
        </DataTable>
      </div>

      <AlertDialog open={carsToDelete.length > 0} onOpenChange={(open) => !open && setCarsToDelete([])}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dict.delete_vehicle_dialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {carsToDelete.length === 1 
                ? dict.delete_vehicle_dialog.description.replace('{make}', carsToDelete[0].make).replace('{model}', carsToDelete[0].model)
                : t.delete_many_desc.replace('{count}', carsToDelete.length.toString())
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{dict.delete_vehicle_dialog.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVehicles} className="bg-destructive hover:bg-destructive/90">
              {dict.delete_vehicle_dialog.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
