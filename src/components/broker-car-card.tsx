
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquarePlus, Tag, Gauge, Waypoints, Cog, Wrench, Heart, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';
import useCopartConsultationStore from '@/hooks/use-copart-consultation-store';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/hooks/use-favorites';
import { ShareModal } from '@/app/[lang]/search/_components/ui/share-modal';
import { useState } from 'react';

type BrokerCarCardProps = {
  car: NormalizedVehicle;
  lang: string;
  dict: any;
  prioritizeImage?: boolean;
  query?: string; // Query actual para contexto
};

const HorizontalSpecItem = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string | number | null, label: string }) => {
    if (!value) return null;
    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground" title={label}>
            <Icon className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">{value}</span>
        </div>
    )
};


export function BrokerCarCard({ car, lang, dict, prioritizeImage = false, query }: BrokerCarCardProps) {
    const { addItem } = useCopartConsultationStore();
    const { toast } = useToast();
    const { isFavorite, addFavorite, removeFavorite, isLoaded } = useFavorites();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const t = dict.copart_card;
    const t_bar = dict.copart_consultation_bar;

    const isFav = isLoaded && car.lot_number ? isFavorite(car.lot_number) : false;
    
    // Build vehicle detail URL with query context
    const detailUrl = query 
        ? `/${lang}/copart/${car.lot_number}?from=${encodeURIComponent(query)}`
        : `/${lang}/copart/${car.lot_number}`;

    const formattedPrice = car.current_bid ? new Intl.NumberFormat(lang, { 
        style: 'currency', 
        currency: 'USD', 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
    }).format(car.current_bid) : 'N/A';

    const handleAddForConsultation = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            lot_number: car.lot_number,
            title: car.title,
            imageUrl: car.imageUrl,
            url: car.url,
        });
        toast({
            title: t_bar.added_title,
            description: `${car.title} ${t_bar.added_desc}`,
        });
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!car.lot_number) return;
        
        if (isFav) {
            removeFavorite(car.lot_number);
            toast({
                title: 'Removido de favoritos',
                description: `${car.title}`,
            });
        } else {
            addFavorite({
                lot_number: car.lot_number,
                title: car.title,
                imageUrl: car.imageUrl || '',
                current_bid: car.current_bid || 0,
            });
            toast({
                title: 'Agregado a favoritos',
                description: `${car.title}`,
            });
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsShareModalOpen(true);
    };

    // Prefetch vehicle details on hover
    const handleMouseEnter = () => {
        if (car.lot_number) {
            // Prefetch with debounce
            const timeoutId = setTimeout(() => {
                fetch(`/api/copart/${car.lot_number}`).catch(() => {
                    // Silent fail for prefetch
                });
            }, 300);
        }
    };

    return (
        <>
            <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl group w-full h-full" onMouseEnter={handleMouseEnter}>
            <div className="relative">
                <Link href={detailUrl} className="block w-full">
                    <div className="aspect-[4/3] w-full relative overflow-hidden bg-secondary">
                        {car.imageUrl ? (
                            <Image
                                src={car.imageUrl}
                                alt={car.title}
                                fill
                                priority={prioritizeImage}
                                loading={prioritizeImage ? "eager" : "lazy"}
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">{dict.car_card.no_image}</div>
                        )}
                    </div>
                </Link>
                {car.year && <Badge variant="secondary" className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 text-xs sm:text-sm">{car.year}</Badge>}
                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 hover:bg-red-50 transition-all hover:scale-110"
                    title={isFav ? "Remover de favoritos" : "Agregar a favoritos"}
                >
                    <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", isFav ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500")} />
                </button>
            </div>
            <CardContent className="p-3 flex-grow flex flex-col">
                <div className="flex-grow">
                    <h3 className="text-base font-bold font-headline truncate">{car.title}</h3>
                    {car.make && car.model && <p className="text-sm font-semibold text-muted-foreground">{car.make} {car.model}</p>}
                    <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                        <span>Lote: {car.lot_number}</span>
                        {car.vin && <span title={car.vin} className="truncate max-w-[50%]">VIN: {car.vin.substring(0, 8)}...</span>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-2 gap-y-2 my-3 border-t pt-3">
                        <HorizontalSpecItem icon={Waypoints} value={car.odometer ? `${car.odometer} mi` : 'N/A'} label="Millas" />
                        <HorizontalSpecItem icon={Tag} value={car.primary_damage || 'N/A'} label="Daño" />
                        <HorizontalSpecItem icon={Wrench} value={car.engine_type || 'N/A'} label="Motor" />
                        <HorizontalSpecItem icon={Cog} value={car.transmission || 'N/A'} label="Trans" />
                    </div>
                    
                    <div className="text-xs space-y-1 my-2">
                        {car.location && <p title={car.location} className="text-muted-foreground truncate">📍 {car.location}</p>}
                        {car.keys && <p className="text-muted-foreground">🔑 {car.keys}</p>}
                        {car.condition && <p className="text-muted-foreground">📋 {car.condition}</p>}
                        {car.buy_it_now_price && <p className="text-muted-foreground">💲 BIN: ${car.buy_it_now_price.toLocaleString()}</p>}
                    </div>
                </div>
                <div className="flex justify-between items-end mt-2 pt-3 border-t">
                    <div>
                        <p className="text-xs text-muted-foreground">{dict.vehicle_comparator?.current_bid || 'Current Bid'}</p>
                        <p className="text-lg font-bold text-primary">{formattedPrice}</p>
                        {car.estimated_retail_value && (
                            <p className="text-xs text-green-600 font-medium">Est: ${car.estimated_retail_value.toLocaleString()}</p>
                        )}
                    </div>
                     <div className="flex flex-col gap-1.5 sm:gap-2">
                        <Button asChild size="sm" className="h-8 sm:h-9 text-xs sm:text-sm">
                            <Link href={detailUrl}>
                                <span className="hidden sm:inline">Ver detalles</span>
                                <span className="sm:hidden">Ver</span>
                                <ArrowRight className="ml-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            </Link>
                        </Button>
                        <div className="flex gap-1">
                            <Button onClick={handleShare} size="sm" variant="outline" className="h-8 sm:h-9 px-2 sm:px-3" title="Compartir">
                                <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            <Button onClick={handleAddForConsultation} size="sm" variant="outline" className="h-8 sm:h-9 px-2 sm:px-3" title="Solicitar asesoría">
                                <MessageSquarePlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        {isShareModalOpen && (
            <ShareModal
                title={car.title}
                lotNumber={car.lot_number || ''}
                imageUrl={car.imageUrl}
                currentBid={car.current_bid || 0}
                lang={lang}
                dict={dict}
                onClose={() => setIsShareModalOpen(false)}
            />
        )}
        </>
    );
}
