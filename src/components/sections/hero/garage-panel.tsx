
'use client';

import useFavoriteStore, { useFavoriteSync } from "@/hooks/use-favorite-store";
import { Car as CarType } from "@/lib/placeholder-data";
import { CarCard } from "@/components/car-card";
import { Heart, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useUser } from "@/firebase";
import useAuthModalStore from "@/hooks/use-auth-modal-store";
import { Button } from "@/components/ui/button";

export default function GaragePanel({ lang, dict, allCars }: { lang: string, dict: any, allCars: CarType[] }) {
    useFavoriteSync();
    const { user, isUserLoading } = useUser();
    const { favoriteIds } = useFavoriteStore();
    const { openModal } = useAuthModalStore();
    const t = dict.hero.right_panel;
    
    const favoriteCars = useMemo(() => {
        if (!allCars || favoriteIds.length === 0) return [];
        const favoriteIdSet = new Set(favoriteIds);
        return allCars.filter(car => favoriteIdSet.has(car.id));
    }, [allCars, favoriteIds]);

    if (isUserLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground aspect-video w-full gap-4">
                <Loader2 className="w-16 h-16 text-accent animate-spin drop-shadow-lg" />
                <p className="font-bold text-white text-lg">{t.loading}</p>
            </div>
        )
    }
    
    if (!user) {
         return (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground aspect-video gap-4 p-8">
                <div className="p-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 shadow-xl">
                    <Heart className="w-16 h-16 text-primary" />
                </div>
                <p className="font-bold text-white text-xl">{t.login_prompt_title}</p>
                <p className="text-sm text-muted-foreground">{t.login_prompt_desc}</p>
                <Button onClick={() => openModal('login')} className="mt-2 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-lg" size="lg">{dict.navigation.login}</Button>
            </div>
        );
    }
    
    if (!allCars || allCars.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground aspect-video w-full gap-4">
                <Loader2 className="w-16 h-16 text-accent animate-spin drop-shadow-lg" />
                <p className="font-bold text-white text-lg">{t.loading_garage}</p>
            </div>
        )
    }
    
    if (favoriteCars.length > 0) {
        const lastFavoriteId = favoriteIds[favoriteIds.length - 1];
        const lastCar = favoriteCars.find(c => c.id === lastFavoriteId) || favoriteCars[0];
        return (
            <div className="w-full">
                <CarCard car={lastCar} lang={lang} dict={dict} />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground aspect-video gap-4 p-8">
            <div className="p-6 rounded-full bg-gradient-to-br from-secondary/20 to-muted/20 shadow-xl">
                <Heart className="w-16 h-16 text-secondary" />
            </div>
            <p className="font-bold text-white text-xl">{t.empty_garage_title}</p>
            <p className="text-sm text-muted-foreground">{t.empty_garage_desc}</p>
        </div>
    );
}
