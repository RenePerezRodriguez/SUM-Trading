'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car as CarType } from '@/lib/placeholder-data';
import { Gauge, Waypoints, Cog, Zap, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

const CarOfTheDayFeature = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="flex flex-col items-center text-center gap-1 p-2 rounded-md bg-white/5 border border-white/10">
        <Icon className="w-5 h-5 text-accent" />
        <p className="font-semibold text-white leading-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
    </div>
);


export default function CarOfTheDay({lang, allCars, dict}: {lang: string, allCars: CarType[], dict: any}) {
    const [carOfTheDay, setCarOfTheDay] = useState<CarType | null>(null);
    const [isChanging, setIsChanging] = useState(false);
    const t = dict.hero.right_panel;

    const pickRandomCar = useCallback(() => {
        if (!allCars || allCars.length === 0) return;
        setIsChanging(true);
        // Exclude current car from the random selection
        const availableCars = allCars.filter(c => c.id !== carOfTheDay?.id);
        const randomCar = availableCars.length > 0 
            ? availableCars[Math.floor(Math.random() * availableCars.length)]
            : allCars[0]; // Fallback if there's only one car
        
        // Simulate a small delay for better user experience
        setTimeout(() => {
            setCarOfTheDay(randomCar);
            setIsChanging(false);
        }, 300);
    }, [allCars, carOfTheDay?.id]);

    useEffect(() => {
        if (allCars && allCars.length > 0 && !carOfTheDay) {
            const randomCar = allCars[Math.floor(Math.random() * allCars.length)];
            setCarOfTheDay(randomCar);
        }
    }, [allCars, carOfTheDay]);

    if (!carOfTheDay) {
        return (
            <div className="w-full aspect-video flex items-center justify-center text-center text-gray-400">
                <p>{t.no_cars_available}</p>
            </div>
        );
    }

    const mainImage = carOfTheDay.images && carOfTheDay.images.length > 0 ? carOfTheDay.images[0] : null;
    
    return (
        <div className="flex flex-col w-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={carOfTheDay.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    <Link href={`/${lang}/cars/${carOfTheDay.id}`} className="w-full group">
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-4 bg-secondary">
                            {mainImage ? (
                                <Image
                                    src={mainImage.url}
                                    alt={`${carOfTheDay.make} ${carOfTheDay.model}`}
                                    fill
                                    priority
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={mainImage.hint}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">{dict.car_card.no_image}</div>
                            )}
                             {isChanging && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><RefreshCw className="w-8 h-8 text-white animate-spin" /></div>}
                        </div>
                        <h3 className="text-xl font-bold font-headline text-center group-hover:text-primary transition-colors">{carOfTheDay.make} {carOfTheDay.model}</h3>
                    </Link>
                    <div className="grid grid-cols-4 gap-2 pt-4 w-full">
                        <CarOfTheDayFeature icon={Gauge} label={t.power} value={`${carOfTheDay.horsepower} hp`} />
                        <CarOfTheDayFeature icon={Waypoints} label={t.mileage} value={`${carOfTheDay.mileage.toLocaleString()} mi`} />
                        <CarOfTheDayFeature icon={Cog} label={t.engine} value={carOfTheDay.engine.split(' ')[0]} />
                        <CarOfTheDayFeature icon={Zap} label={t.transmission} value={dict.add_vehicle_page.fields.transmission_types[carOfTheDay.transmission.toLowerCase() as keyof typeof dict.add_vehicle_page.fields.transmission_types] || carOfTheDay.transmission} />
                    </div>
                </motion.div>
            </AnimatePresence>

             <Button 
                onClick={pickRandomCar} 
                variant="outline" 
                size="sm" 
                className="mt-4 w-full bg-white/10 text-white hover:bg-white/20 border-white/20 font-semibold" 
                disabled={isChanging || !allCars || allCars.length < 2}
            >
                <RefreshCw className={`mr-2 h-4 w-4 ${isChanging ? 'animate-spin' : ''}`} />
                {isChanging ? t.loading : t.see_another}
            </Button>
        </div>
    );
}
