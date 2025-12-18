'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw, Loader2 } from 'lucide-react';
import type { Locale } from '@/lib/i18n-config';

type CarFiltersProps = {
    dict: any;
    makes: string[];
    types: string[];
    naturalQuery: string;
    setNaturalQuery: (q: string) => void;
    isAiSearchLoading: boolean;
    selectedMake: string;
    setSelectedMake: (m: string) => void;
    selectedTypes: string[];
    setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
    priceRange: [number, number];
    setPriceRange: (r: [number, number]) => void;
    minPrice: number;
    maxPrice: number;
    yearRange: [number, number];
    setYearRange: (r: [number, number]) => void;
    minYear: number;
    maxYear: number;
    onReset: () => void;
};

export default function CarFilters({
    dict,
    makes,
    types,
    naturalQuery,
    setNaturalQuery,
    isAiSearchLoading,
    selectedMake,
    setSelectedMake,
    selectedTypes,
    setSelectedTypes,
    priceRange,
    setPriceRange,
    minPrice,
    maxPrice,
    yearRange,
    setYearRange,
    minYear,
    maxYear,
    onReset
}: CarFiltersProps) {
    const handleTypeChange = (type: string) => {
        setSelectedTypes(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };
    
    const lang = dict.lang === 'es-ES' ? 'es' : 'en';

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{dict.car_catalog.filters_title}</h3>
                <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {dict.car_catalog.reset}
                </Button>
            </div>

            <div className="relative">
                {isAiSearchLoading ? (
                    <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                ) : (
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
                <Input
                    placeholder={dict.car_catalog.natural_search_placeholder}
                    className="pl-10"
                    value={naturalQuery}
                    onChange={(e) => setNaturalQuery(e.target.value)}
                    aria-label="Búsqueda por lenguaje natural"
                />
            </div>
            
            <div className="space-y-4">
                <Label>{dict.car_catalog.make_filter_title}</Label>
                <Select value={selectedMake} onValueChange={setSelectedMake}>
                    <SelectTrigger aria-label={`Filtrar por ${dict.car_catalog.make_filter_title}`}>
                        <SelectValue placeholder={dict.car_catalog.filter_make} />
                    </SelectTrigger>
                    <SelectContent>
                        {makes.map((make) => (
                            <SelectItem key={make} value={make}>
                                {make === 'all' ? dict.car_catalog.all_makes : make}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                <Label>{dict.car_catalog.type_filter_title}</Label>
                <div className="space-y-2">
                    {types.map((type) => (
                        <div key={type} className="flex items-center gap-2">
                            <Checkbox 
                                id={`type-${type}`}
                                checked={selectedTypes.includes(type)}
                                onCheckedChange={() => handleTypeChange(type)}
                            />
                            <Label htmlFor={`type-${type}`} className="font-normal">{type}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <Label>{dict.car_catalog.price_range_title}</Label>
                <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    min={minPrice}
                    max={maxPrice}
                    step={1000}
                    aria-label={dict.car_catalog.price_range_title}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatCurrency(priceRange[0])}</span>
                    <span>{formatCurrency(priceRange[1])}</span>
                </div>
            </div>

            <div className="space-y-4">
                <Label>{dict.car_catalog.year_range_title}</Label>
                <Slider
                    value={yearRange}
                    onValueChange={(value) => setYearRange(value as [number, number])}
                    min={minYear}
                    max={maxYear}
                    step={1}
                    aria-label={dict.car_catalog.year_range_title}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{yearRange[0]}</span>
                    <span>{yearRange[1]}</span>
                </div>
            </div>

        </div>
    );
}
