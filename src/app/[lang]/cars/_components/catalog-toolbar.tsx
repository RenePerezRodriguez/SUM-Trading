'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import type { ViewMode } from '@/hooks/use-car-filters';
import { memo } from 'react';

type CatalogToolbarProps = {
    dict: any;
    totalResults: number;
    sortOrder: string;
    setSortOrder: (order: string) => void;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
};

const CatalogToolbar = memo(function CatalogToolbar({ dict, totalResults, sortOrder, setSortOrder, viewMode, setViewMode }: CatalogToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-8 gap-3 p-4 rounded-xl border-2 border-border bg-secondary/20">
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                <p className="text-sm font-medium text-foreground">
                    <span className="font-bold text-primary">{totalResults}</span> {dict.car_catalog.results}
                </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-1 p-1 rounded-lg bg-background border">
                    <Button 
                        variant={viewMode === 'list' ? 'default' : 'ghost'} 
                        size="sm" 
                        onClick={() => setViewMode('list')}
                        aria-label={dict.car_catalog.list_view}
                        className="transition-all"
                    >
                        <List className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                        size="sm" 
                        onClick={() => setViewMode('grid')}
                        aria-label={dict.car_catalog.grid_view}
                        className="transition-all"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </Button>
                </div>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[180px] bg-background">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="price_asc">{dict.car_catalog.price_asc}</SelectItem>
                        <SelectItem value="price_desc">{dict.car_catalog.price_desc}</SelectItem>
                        <SelectItem value="year_desc">{dict.car_catalog.year_desc}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
});

export default CatalogToolbar;
