
'use client';

import type { Locale } from '@/lib/i18n-config';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquarePlus, ArrowLeft } from 'lucide-react';
import { useUser } from '@/firebase';
import useAuthModalStore from '@/hooks/use-auth-modal-store';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';
import CopartSpecifications from './copart-specifications';
import useCopartConsultationStore from '@/hooks/use-copart-consultation-store';
import { useToast } from '@/hooks/use-toast';

function CopartImageGallery({ vehicle }: { vehicle: NormalizedVehicle }) {
    const allImages = vehicle.images_full || [];
    const [mainImage, setMainImage] = useState(allImages.length > 0 ? allImages[0] : vehicle.imageUrl);
  
    if (!mainImage) {
      return (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl bg-secondary flex items-center justify-center">
          <p className="text-muted-foreground">Sin imagen</p>
        </div>
      );
    }
  
    return (
      <div className="space-y-4 sticky top-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={mainImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl"
          >
            <Image
              src={mainImage}
              alt={`${vehicle.title} - ${vehicle.make} ${vehicle.model} ${vehicle.year}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
        
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setMainImage(image)}
                className={cn(
                  "relative aspect-square w-full overflow-hidden rounded-md transition-all duration-200 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  image === mainImage ? 'ring-2 ring-primary' : 'hover:opacity-80'
                )}
              >
                <Image
                  src={image}
                  alt={`${vehicle.title} - Vista ${index + 1} de ${allImages.length}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
}

export default function CopartDetailsClient({ vehicle, lang, dict }: { vehicle: NormalizedVehicle, lang: Locale; dict: any }) {
    const { user } = useUser();
    const { openModal } = useAuthModalStore();
    const router = useRouter();
    const { addItem } = useCopartConsultationStore();
    const { toast } = useToast();
    const t = dict?.copart_card || {};
    const t_bar = dict?.copart_consultation_bar || {};

    // Parsear current_bid - puede venir como string "$1,234" o número
    let bidAmount = 0;
    if (typeof vehicle.current_bid === 'number') {
        bidAmount = vehicle.current_bid;
    } else if (typeof vehicle.current_bid === 'string' && vehicle.current_bid !== 'N/A') {
        // Remover símbolos y convertir a número
        const cleanBid = (vehicle.current_bid as string).replace(/[$,]/g, '');
        bidAmount = parseFloat(cleanBid) || 0;
    }

    const formattedPrice = bidAmount > 0 ? new Intl.NumberFormat(lang, { 
        style: 'currency', 
        currency: 'USD', 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
    }).format(bidAmount) : 'N/A';
    
    const handleAddForConsultation = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(vehicle);
        toast({
            title: t_bar.added_title || 'Vehicle Added',
            description: `${vehicle.title} ${t_bar.added_desc || 'has been added to your consultation list.'}`,
        });
    };

    return (
        <div className="container py-12 pt-44">
            <div className="mb-6">
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {dict?.register_page?.back_button || 'Back'}
                </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
                <CopartImageGallery vehicle={vehicle} />

                <div className="flex flex-col gap-6">
                    <div>
                        {vehicle.year && <Badge variant="secondary" className="mb-2 w-fit">{vehicle.year}</Badge>}
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
                            {vehicle.title}
                        </h1>
                        {vehicle.make && vehicle.model && <p className="text-xl text-muted-foreground mt-1">{vehicle.make} {vehicle.model}</p>}

                        <div className="flex justify-between items-center bg-secondary p-4 rounded-lg my-4">
                            <div>
                                <p className="text-muted-foreground text-sm">{dict?.vehicle_comparator?.current_bid_approx || 'Current Bid (Approx.)'}</p>
                                <p className="text-3xl font-bold text-primary text-right">
                                    {formattedPrice}
                                </p>
                            </div>
                            <Button 
                                size="lg" 
                                className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-7 font-bold" 
                                onClick={handleAddForConsultation}
                            >
                                <MessageSquarePlus className="mr-2 h-5 w-5" />
                                {t.request_consultation || 'Request Consultation'}
                            </Button>
                        </div>
                    </div>
                    
                    <CopartSpecifications vehicle={vehicle} dict={dict} />
                    
                    {vehicle.engine_video && (
                        <Card className="bg-secondary/50">
                            <CardContent className="p-4">
                                <h3 className="font-bold mb-2">Video del Motor</h3>
                                <video src={vehicle.engine_video} controls className="w-full rounded-lg" />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
