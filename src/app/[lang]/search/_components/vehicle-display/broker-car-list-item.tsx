
'use client';

import React, { useState } from 'react';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, Tag, ArrowRight, Gauge, Waypoints, Cog, ShieldQuestion, Wrench, Heart, Share2 } from 'lucide-react';
import useCopartConsultationStore from '@/hooks/use-copart-consultation-store';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';
import { ShareModal } from '../ui/share-modal';

const HorizontalSpecItem = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string | number, label: string }) => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground" title={label}>
        <Icon className="w-4 h-4" />
        <span className="font-medium text-foreground">{value}</span>
    </div>
);

export default function BrokerCarListItem({ car, lang, dict, prioritizeImage = false, query }: { car: NormalizedVehicle; lang: string; dict: any; prioritizeImage?: boolean; query?: string }) {
    const { addItem } = useCopartConsultationStore();
    const { toast } = useToast();
    const { isFavorite, addFavorite, removeFavorite, isLoaded } = useFavorites();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const t_bar = dict?.copart_consultation_bar || {};

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
            title: t_bar.added_title || 'Vehicle Added',
            description: `${car.title} ${t_bar.added_desc || 'has been added to your consultation list.'}`,
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
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group w-full" onMouseEnter={handleMouseEnter}>
            <div className="block md:flex">
                {/* Image Container */}
                <div className="md:w-1/3 relative">
                    <Link href={detailUrl} className="block aspect-[4/3] w-full relative overflow-hidden bg-secondary">
                        {car.imageUrl ? (
                            <Image
                                src={car.imageUrl}
                                alt={car.title}
                                fill
                                priority={prioritizeImage}
                                loading={prioritizeImage ? "eager" : "lazy"}
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sin imagen</div>
                        )}
                         {car.year && <Badge variant="secondary" className="absolute top-3 left-3 z-10">{car.year}</Badge>}
                    </Link>
                </div>
                
                {/* Details Container */}
                <div className="md:w-2/3 p-6 flex flex-col h-full">
                    {/* Top Section */}
                    <div className="flex-grow">
                        <Link href={detailUrl} className="block">
                            <h3 className="text-xl font-bold font-headline group-hover:text-primary transition-colors">{car.title}</h3>
                        </Link>
                        {car.make && car.model && <p className="text-sm font-semibold text-muted-foreground">{car.make} {car.model}</p>}
                        <div className="text-sm text-muted-foreground mb-4 mt-1 flex justify-between">
                            <span>Lote: {car.lot_number}</span>
                            {car.vin && <span title={car.vin} className="truncate">VIN: {car.vin.substring(0, 10)}...</span>}
                        </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 my-4">
                            <HorizontalSpecItem icon={Waypoints} value={car.odometer ? `${car.odometer} mi` : 'N/A'} label="Millas" />
                            {car.primary_damage && <HorizontalSpecItem icon={Tag} value={car.primary_damage} label="Daño" />}
                            {car.engine_type && <HorizontalSpecItem icon={Wrench} value={car.engine_type} label="Motor" />}
                            {car.transmission && <HorizontalSpecItem icon={Cog} value={car.transmission} label="Transmisión" />}
                        </div>

                        <div className="text-xs text-muted-foreground space-y-1">
                            {car.location && <p title={car.location} className="truncate">📍 {car.location}</p>}
                            {car.keys && <p>🔑 {car.keys}</p>}
                            {car.condition && <p>📋 {car.condition}</p>}
                            {car.buy_it_now_price && <p>💲 BIN: ${car.buy_it_now_price.toLocaleString()}</p>}
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between border-t pt-4 mt-auto gap-4 sm:gap-0">
                        <div>
                            <p className="text-xs text-muted-foreground">{dict?.vehicle_comparator?.current_bid || 'Current Bid'}</p>
                            <p className="text-2xl font-bold text-primary">{formattedPrice}</p>
                            {car.estimated_retail_value && (
                                <p className="text-xs text-green-600 font-medium">Est: ${car.estimated_retail_value.toLocaleString()}</p>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button onClick={handleToggleFavorite} size="sm" variant="outline" title={isFav ? "Remover de favoritos" : "Agregar a favoritos"}>
                                <Heart className={cn("h-4 w-4", isFav ? "fill-red-500 text-red-500" : "text-gray-400")} />
                            </Button>
                            <Button onClick={handleShare} size="sm" variant="outline" title="Compartir">
                                <Share2 className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Compartir</span>
                            </Button>
                            <Button onClick={handleAddForConsultation} size="sm" variant="outline">
                                <MessageSquarePlus className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Asesoría</span>
                                <span className="sm:hidden">Consultar</span>
                            </Button>
                            <Button asChild size="sm">
                                <Link href={detailUrl}>
                                    Ver <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            </Card>

            {isShareModalOpen && (
                <ShareModal
                    title={car.title}
                    lotNumber={car.lot_number || ''}
                    imageUrl={car.imageUrl || ''}
                    currentBid={car.current_bid || 0}
                    lang={lang}
                    dict={dict}
                    onClose={() => setIsShareModalOpen(false)}
                />
            )}
        </>
    );
}
