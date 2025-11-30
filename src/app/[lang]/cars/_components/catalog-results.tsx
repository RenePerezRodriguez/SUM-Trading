'use client';

import type { Car } from '@/lib/placeholder-data';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import CarListItem from './car-list-item';
import { CarCard } from '@/components/car-card';
import type { ViewMode } from '@/hooks/use-car-filters';
import CatalogToolbar from './catalog-toolbar';
import CatalogPagination from './catalog-pagination';

type CatalogResultsProps = {
    cars: Car[];
    dict: any;
    lang: string;
    sortOrder: string;
    setSortOrder: (order: string) => void;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    totalResults: number;
    onOpenFilters?: () => void;
};

const NoResults = ({ dict }: { dict: any }) => (
    <div className="text-center py-16 col-span-full">
        <p className="text-lg text-muted-foreground">{dict.car_catalog.no_results}</p>
    </div>
);

export default function CatalogResults({ 
    cars, 
    dict, 
    lang, 
    totalResults,
    onOpenFilters,
    ...props
}: CatalogResultsProps) {

    return (
        <div>
            <CatalogToolbar 
                dict={dict} 
                totalResults={totalResults} 
                onOpenFilters={onOpenFilters}
                {...props} 
            />

            {totalResults > 0 ? (
                <motion.div 
                    layout 
                    className={cn("flex flex-col gap-3 md:gap-4", {
                        "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start gap-3 md:gap-4 lg:gap-6": props.viewMode === 'grid'
                    })}
                >
                    <AnimatePresence>
                        {cars.map((car) => (
                            <motion.div
                                key={car.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                {props.viewMode === 'list' ? (
                                    <CarListItem car={car} lang={lang} dict={dict} />
                                ) : (
                                    <CarCard car={car} lang={lang} dict={dict} />
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <NoResults dict={dict} />
            )}

            {totalResults > 0 && <CatalogPagination totalPages={props.totalPages} currentPage={props.currentPage} setCurrentPage={props.setCurrentPage} />}
        </div>
    );
}
