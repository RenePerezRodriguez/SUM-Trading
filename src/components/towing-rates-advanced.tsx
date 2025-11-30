'use client';

import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Search,
    MapPin,
    Calculator,
    ChevronDown,
    ChevronUp,
    MessageCircle,
    FileText,
    Info,
    Phone,
    Filter,
    ArrowRight
} from 'lucide-react';
import { geoCentroid } from 'd3-geo';
import Link from 'next/link';
import { motion } from 'framer-motion';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

interface City {
    name: string;
    price?: number;
    origin?: string;
}

interface StateData {
    name: string;
    cities: City[];
}

interface TowingRatesData {
    [key: string]: StateData;
}

const stateAbbreviations: Record<string, string> = {
    'Alabama': 'AL', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL',
    'Georgia': 'GA', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN',
    'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA',
    'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI',
    'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT',
    'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND',
    'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA',
    'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN',
    'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA',
    'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
};

export default function TowingRatesAdvanced({ dict, lang = 'es' }: { dict: any; lang?: string }) {
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'state' | 'city' | 'price'>('price');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeView, setActiveView] = useState<'map' | 'table'>('map');

    // Calculadora
    const [calcState, setCalcState] = useState('');
    const [calcCity, setCalcCity] = useState('');
    const [vehicleType, setVehicleType] = useState<'sedan' | 'sublete' | 'pickup'>('sedan');

    const itemsPerPage = 15;

    // Construir datos desde dict
    const towingRates: TowingRatesData = useMemo(() => {
        const rates: TowingRatesData = {};
        const statesData = dict.towing_rates?.states || {};

        Object.keys(statesData).forEach(stateKey => {
            const stateInfo = statesData[stateKey];
            if (stateInfo.cities) {
                rates[stateInfo.name] = {
                    name: stateInfo.name,
                    cities: stateInfo.cities
                };
            }
        });

        return rates;
    }, [dict]);

    // Extraer todas las ciudades para tabla
    const allCities = useMemo(() => {
        const cities: Array<{ state: string; city: string; price: number; origin: string }> = [];

        Object.keys(towingRates).forEach(state => {
            towingRates[state].cities.forEach(city => {
                if (city.price) {
                    cities.push({
                        state,
                        city: city.name,
                        price: city.price,
                        origin: city.origin || 'Miami, Houston, Delaware, Brownsville'
                    });
                }
            });
        });
        return cities;
    }, [towingRates]);

    // Filtrar y ordenar
    const filteredCities = useMemo(() => {
        let filtered = allCities;

        // Búsqueda
        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.city.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filtro de precio
        if (priceFilter !== 'all') {
            const ranges: Record<string, [number, number]> = {
                'low': [0, 400],
                'medium': [400, 700],
                'high': [700, 900],
                'very-high': [900, 9999]
            };
            const [min, max] = ranges[priceFilter];
            filtered = filtered.filter(item => item.price >= min && item.price < max);
        }

        // Ordenar
        filtered.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'state') comparison = a.state.localeCompare(b.state);
            else if (sortBy === 'city') comparison = a.city.localeCompare(b.city);
            else comparison = a.price - b.price;

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [allCities, searchQuery, priceFilter, sortBy, sortOrder]);

    // Paginación
    const totalPages = Math.ceil(filteredCities.length / itemsPerPage);
    const paginatedCities = filteredCities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Helpers
    const getAveragePrice = (state: string): number => {
        const stateData = towingRates[state];
        if (!stateData?.cities.length) return 0;
        const prices = stateData.cities.filter(c => c.price).map(c => c.price!);
        if (!prices.length) return 0;
        return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    };

    const getPriceColor = (price: number): string => {
        if (price === 0) return '#e5e7eb';
        if (price < 400) return '#22c55e';
        if (price < 700) return '#eab308';
        if (price < 900) return '#f97316';
        return '#ef4444';
    };

    const handleSort = (column: 'state' | 'city' | 'price') => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
        setCurrentPage(1);
    };

    // Calcular costo
    const calculateCost = () => {
        if (!calcState || !calcCity) return null;

        const stateData = towingRates[calcState];
        const cityData = stateData?.cities.find(c => c.name === calcCity);
        const basePrice = cityData?.price || 0;

        const additionalCost = vehicleType === 'sedan' ? 0 : 100;
        return basePrice + additionalCost;
    };

    const totalCost = calculateCost();

    const SortIcon = ({ column }: { column: string }) => {
        if (sortBy !== column) return <ChevronDown className="w-4 h-4 opacity-30" />;
        return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline tracking-tight">
                    {dict.towing_rates?.title}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Transporte terrestre desde <span className="font-semibold text-primary">Miami, Houston, Delaware y Brownsville</span>
                </p>
            </div>

            {/* Calculadora Rápida - Improved Design */}
            <Card className="border-none shadow-xl bg-white dark:bg-card overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Calculator className="w-6 h-6" />
                        </div>
                        {lang === 'es' ? 'Calculadora de Costos' : 'Cost Calculator'}
                    </CardTitle>
                    <CardDescription className="text-base">
                        {lang === 'es' ? 'Cotiza el envío de tu vehículo al instante' : 'Quote your vehicle shipping instantly'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">{lang === 'es' ? 'Estado' : 'State'}</label>
                            <Select value={calcState} onValueChange={(val) => {
                                setCalcState(val);
                                setCalcCity('');
                            }}>
                                <SelectTrigger className="h-12 bg-muted/30 border-muted-foreground/20 focus:ring-primary">
                                    <SelectValue placeholder={lang === 'es' ? 'Seleccionar estado' : 'Select state'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(towingRates).sort().map(state => (
                                        <SelectItem key={state} value={state}>
                                            {state}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">{lang === 'es' ? 'Ciudad' : 'City'}</label>
                            <Select value={calcCity} onValueChange={setCalcCity} disabled={!calcState}>
                                <SelectTrigger className="h-12 bg-muted/30 border-muted-foreground/20 focus:ring-primary">
                                    <SelectValue placeholder={lang === 'es' ? 'Seleccionar ciudad' : 'Select city'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {calcState && towingRates[calcState]?.cities
                                        .filter(c => c.price)
                                        .map(city => (
                                            <SelectItem key={city.name} value={city.name}>
                                                {city.name} - ${city.price}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">{lang === 'es' ? 'Tipo de Vehículo' : 'Vehicle Type'}</label>
                            <Select value={vehicleType} onValueChange={(val: any) => setVehicleType(val)}>
                                <SelectTrigger className="h-12 bg-muted/30 border-muted-foreground/20 focus:ring-primary">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sedan">{lang === 'es' ? 'Sedan (Base)' : 'Sedan (Base)'}</SelectItem>
                                    <SelectItem value="sublete">{lang === 'es' ? 'Sublete (+$100)' : 'Sublete (+$100)'}</SelectItem>
                                    <SelectItem value="pickup">{lang === 'es' ? 'Pickup/SUV 3 filas (+$100)' : 'Pickup/SUV 3 rows (+$100)'}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {totalCost !== null && (
                        <div className="mt-6 p-6 bg-primary/5 rounded-xl border border-primary/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Calculator className="w-24 h-24 text-primary" />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        {lang === 'es' ? 'Costo Total Estimado' : 'Estimated Total Cost'}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                                            ${totalCost}
                                        </span>
                                        <span className="text-xl font-medium text-muted-foreground">USD</span>
                                    </div>
                                    {vehicleType !== 'sedan' && (
                                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground bg-background/50 px-3 py-1 rounded-full w-fit">
                                            <span className="font-medium">{lang === 'es' ? 'Base' : 'Base'}: ${totalCost - 100}</span>
                                            <span>+</span>
                                            <span className="font-medium text-primary">{lang === 'es' ? 'Adicional' : 'Additional'}: $100</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                    <Button size="lg" asChild className="bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-lg shadow-green-500/20 w-full sm:w-auto">
                                        <a href={`https://wa.me/19567476078?text=Hola, me interesa el servicio de arrastre desde ${calcCity}, ${calcState}`} target="_blank" rel="noopener noreferrer">
                                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                            {lang === 'es' ? 'Solicitar Ahora' : 'Request Now'}
                                        </a>
                                    </Button>
                                    <Button variant="outline" size="lg" asChild className="w-full sm:w-auto border-primary/20 hover:bg-primary/5">
                                        <a href="tel:+19567476078">
                                            <Phone className="w-5 h-5 mr-2" />
                                            {lang === 'es' ? 'Llamar' : 'Call'}
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tabs: Mapa vs Tabla */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <Tabs value={activeView} onValueChange={(v: any) => setActiveView(v)} className="space-y-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        <TabsList className="grid w-full lg:w-[320px] grid-cols-2 h-12 p-1 bg-muted/50">
                            <TabsTrigger value="map" className="h-full gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <MapPin className="w-4 h-4" />
                                {lang === 'es' ? 'Mapa Interactivo' : 'Interactive Map'}
                            </TabsTrigger>
                            <TabsTrigger value="table" className="h-full gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <Filter className="w-4 h-4" />
                                {lang === 'es' ? 'Lista Detallada' : 'Detailed List'}
                            </TabsTrigger>
                        </TabsList>

                        {activeView === 'table' && (
                            <Card className="w-full lg:w-auto border-none shadow-none bg-transparent">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1 sm:min-w-[240px]">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder={lang === 'es' ? 'Buscar estado o ciudad...' : 'Search state or city...'}
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="pl-9 h-12 bg-white dark:bg-card border-muted-foreground/20"
                                        />
                                    </div>
                                    <Select value={priceFilter} onValueChange={(val) => {
                                        setPriceFilter(val);
                                        setCurrentPage(1);
                                    }}>
                                        <SelectTrigger className="h-12 w-full sm:w-[180px] bg-white dark:bg-card border-muted-foreground/20">
                                            <SelectValue placeholder={lang === 'es' ? 'Precio' : 'Price'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{lang === 'es' ? 'Todos los precios' : 'All prices'}</SelectItem>
                                            <SelectItem value="low">$200 - $400</SelectItem>
                                            <SelectItem value="medium">$400 - $700</SelectItem>
                                            <SelectItem value="high">$700 - $900</SelectItem>
                                            <SelectItem value="very-high">$900+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Vista Mapa */}
                    <TabsContent value="map" className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                        <div className="grid lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-2 p-1 border-none shadow-xl bg-white dark:bg-card overflow-hidden">
                                <div className="p-6 bg-muted/10">
                                    {/* Indicaciones */}
                                    <div className="mb-6 p-4 bg-blue-50/50 dark:bg-blue-950/10 rounded-xl border border-blue-100 dark:border-blue-900/50 backdrop-blur-sm">
                                        <div className="flex items-start gap-3 text-sm text-blue-700 dark:text-blue-300">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                                                <Info className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-semibold mb-2 text-base">{lang === 'es' ? 'Guía del Mapa' : 'Map Guide'}</p>
                                                <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm">
                                                    <li className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                        <span>{lang === 'es' ? 'Click para ver ciudades' : 'Click to see cities'}</span>
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                        <span>{lang === 'es' ? 'Colores indican precio' : 'Colors show price'}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <ComposableMap projection="geoAlbersUsa">
                                        <Geographies geography={geoUrl}>
                                            {({ geographies }) => (
                                                <>
                                                    {geographies.map((geo) => {
                                                        const stateName = geo.properties.name;
                                                        const avgPrice = getAveragePrice(stateName);
                                                        const isSelected = selectedState === stateName;

                                                        return (
                                                            <Geography
                                                                key={geo.rsmKey}
                                                                geography={geo}
                                                                onClick={() => {
                                                                    if (avgPrice > 0) {
                                                                        setSelectedState(selectedState === stateName ? null : stateName);
                                                                    }
                                                                }}
                                                                style={{
                                                                    default: {
                                                                        fill: isSelected ? '#3b82f6' : getPriceColor(avgPrice),
                                                                        stroke: '#fff',
                                                                        strokeWidth: 0.75,
                                                                        outline: 'none',
                                                                        cursor: avgPrice > 0 ? 'pointer' : 'default'
                                                                    },
                                                                    hover: {
                                                                        fill: avgPrice > 0 ? '#3b82f6' : getPriceColor(avgPrice),
                                                                        stroke: '#fff',
                                                                        strokeWidth: 1,
                                                                        outline: 'none',
                                                                    },
                                                                    pressed: {
                                                                        fill: '#2563eb',
                                                                        stroke: '#fff',
                                                                        strokeWidth: 1,
                                                                        outline: 'none',
                                                                    },
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                    {geographies.map((geo) => {
                                                        const centroid = geoCentroid(geo);
                                                        const stateName = geo.properties.name;
                                                        const abbr = stateAbbreviations[stateName];
                                                        const avgPrice = getAveragePrice(stateName);

                                                        if (!abbr || avgPrice === 0) return null;

                                                        return (
                                                            <Marker key={`${geo.rsmKey}-marker`} coordinates={centroid}>
                                                                <text
                                                                    y="2"
                                                                    fontSize={10}
                                                                    textAnchor="middle"
                                                                    fill="#fff"
                                                                    style={{
                                                                        pointerEvents: "none",
                                                                        fontWeight: "bold",
                                                                        textShadow: "0px 0px 2px rgba(0,0,0,0.5)"
                                                                    }}
                                                                >
                                                                    {abbr}
                                                                </text>
                                                            </Marker>
                                                        );
                                                    })}
                                                </>
                                            )}
                                        </Geographies>
                                    </ComposableMap>

                                    <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }} />
                                            <span>$200-$400</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }} />
                                            <span>$400-$700</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }} />
                                            <span>$700-$900</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }} />
                                            <span>$900+</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="space-y-4">
                                <Card className="p-6">
                                    {selectedState && towingRates[selectedState] ? (
                                        <div>
                                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                {selectedState}
                                                <Badge variant="secondary">
                                                    {stateAbbreviations[selectedState]}
                                                </Badge>
                                            </h3>
                                            <p className="text-xs text-muted-foreground mb-4">
                                                {towingRates[selectedState].cities.filter(c => c.price).length} ubicaciones disponibles
                                            </p>
                                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                                {towingRates[selectedState].cities
                                                    .filter(c => c.price)
                                                    .map((city) => (
                                                        <div key={city.name} className="flex justify-between items-center py-2 border-b last:border-0">
                                                            <span className="text-sm">{city.name}</span>
                                                            <span className="font-semibold text-primary">${city.price}</span>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div className="mt-4 pt-4 border-t">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold">Promedio:</span>
                                                    <span className="text-lg font-bold text-primary">
                                                        ${getAveragePrice(selectedState)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="min-h-[500px] flex flex-col items-center justify-center text-center text-muted-foreground px-4">
                                            <MapPin className="w-16 h-16 mb-4 opacity-20" />
                                            <p className="font-medium mb-2">Selecciona un estado en el mapa</p>
                                            <p className="text-sm">Haz click en cualquier estado coloreado para ver sus tarifas de arrastre</p>
                                        </div>
                                    )}
                                </Card>                            <Card className="p-4 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
                                    <p className="text-sm text-amber-800 dark:text-amber-400 font-medium flex gap-2">
                                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        Pickups + SUV (3 Filas): +$100 USD adicional
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Vista Tabla */}
                    <TabsContent value="table" className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                        {/* Indicaciones para tabla */}
                        <div className="mb-6 p-4 bg-blue-50/50 dark:bg-blue-950/10 rounded-xl border border-blue-100 dark:border-blue-900/50 backdrop-blur-sm">
                            <div className="flex items-start gap-3 text-sm text-blue-700 dark:text-blue-300">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                                    <Info className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-semibold mb-2 text-base">{lang === 'es' ? 'Guía de la Tabla' : 'Table Guide'}</p>
                                    <p className="mb-2 text-blue-600 dark:text-blue-400">{lang === 'es' ? 'Transporte desde Miami, Houston, Delaware y Brownsville' : 'Transportation from Miami, Houston, Delaware and Brownsville'}</p>
                                    <ul className="grid sm:grid-cols-3 gap-x-4 gap-y-2 text-xs sm:text-sm">
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <span>{lang === 'es' ? 'Búsqueda en tiempo real' : 'Real-time search'}</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <span>{lang === 'es' ? 'Filtros avanzados' : 'Advanced filters'}</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <span>{lang === 'es' ? 'Ordenamiento por columnas' : 'Sort by columns'}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <Card>
                            <CardContent className="p-6">
                                {/* Vista móvil: Cards */}
                                <div className="md:hidden space-y-3">
                                    {paginatedCities.length > 0 ? (
                                        paginatedCities.map((item, idx) => (
                                            <Card key={idx} className="p-4 shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-sm">{item.state}</p>
                                                        <p className="text-xs text-muted-foreground">{item.city}</p>
                                                        <p className="text-xs text-primary mt-1 font-medium">📍 {item.origin}</p>
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-base font-bold"
                                                        style={{
                                                            backgroundColor: getPriceColor(item.price) + '20',
                                                            color: getPriceColor(item.price),
                                                            borderColor: getPriceColor(item.price)
                                                        }}
                                                    >
                                                        ${item.price}
                                                    </Badge>
                                                </div>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            {lang === 'es' ? 'No se encontraron resultados' : 'No results found'}
                                        </div>
                                    )}
                                </div>

                                {/* Vista desktop: Tabla */}
                                <div className="hidden md:block rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead
                                                    className="cursor-pointer select-none hover:bg-muted/50"
                                                    onClick={() => handleSort('state')}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {lang === 'es' ? 'Estado' : 'State'}
                                                        <SortIcon column="state" />
                                                    </div>
                                                </TableHead>
                                                <TableHead
                                                    className="cursor-pointer select-none hover:bg-muted/50"
                                                    onClick={() => handleSort('city')}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {lang === 'es' ? 'Ciudad' : 'City'}
                                                        <SortIcon column="city" />
                                                    </div>
                                                </TableHead>
                                                <TableHead className="cursor-pointer select-none hover:bg-muted/50">
                                                    {lang === 'es' ? 'Destino' : 'Destination'}
                                                </TableHead>
                                                <TableHead
                                                    className="text-right cursor-pointer select-none hover:bg-muted/50"
                                                    onClick={() => handleSort('price')}
                                                >
                                                    <div className="flex items-center justify-end gap-2">
                                                        {lang === 'es' ? 'Precio' : 'Price'}
                                                        <SortIcon column="price" />
                                                    </div>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedCities.length > 0 ? (
                                                paginatedCities.map((item, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell className="font-medium">{item.state}</TableCell>
                                                        <TableCell>{item.city}</TableCell>
                                                        <TableCell className="text-muted-foreground">{item.origin}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Badge
                                                                variant="secondary"
                                                                style={{
                                                                    backgroundColor: getPriceColor(item.price) + '20',
                                                                    color: getPriceColor(item.price),
                                                                    borderColor: getPriceColor(item.price)
                                                                }}
                                                            >
                                                                ${item.price}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                        {lang === 'es' ? 'No se encontraron resultados' : 'No results found'}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Paginación */}
                                {totalPages > 1 && (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                                        <p className="text-sm text-muted-foreground text-center sm:text-left">
                                            {lang === 'es' ? 'Mostrando' : 'Showing'} {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredCities.length)} {lang === 'es' ? 'de' : 'of'} {filteredCities.length} {lang === 'es' ? 'resultados' : 'results'}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="px-2 sm:px-4"
                                            >
                                                <span className="hidden sm:inline">{lang === 'es' ? 'Anterior' : 'Previous'}</span>
                                                <span className="sm:hidden">←</span>
                                            </Button>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    let pageNum;
                                                    if (totalPages <= 5) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage <= 3) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage >= totalPages - 2) {
                                                        pageNum = totalPages - 4 + i;
                                                    } else {
                                                        pageNum = currentPage - 2 + i;
                                                    }

                                                    return (
                                                        <Button
                                                            key={i}
                                                            variant={currentPage === pageNum ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            className={`w-9 ${currentPage === pageNum ? 'bg-black hover:bg-black/90 text-white' : ''}`}
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="px-2 sm:px-4"
                                            >
                                                <span className="hidden sm:inline">{lang === 'es' ? 'Siguiente' : 'Next'}</span>
                                                <span className="sm:hidden">→</span>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>

            {/* CTAs */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid md:grid-cols-2 gap-6"
            >
                <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="p-8 relative z-10">
                        <div className="flex flex-col h-full justify-between gap-6">
                            <div>
                                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{lang === 'es' ? '¿Necesitas ayuda personalizada?' : 'Need personalized help?'}</h3>
                                <p className="text-muted-foreground">
                                    {lang === 'es'
                                        ? 'Nuestros asesores están listos para cotizar tu envío específico y resolver tus dudas.'
                                        : 'Our advisors are ready to quote your specific shipment and answer your questions.'}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button asChild className="bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-lg shadow-green-500/20 flex-1">
                                    <a href="https://wa.me/19567476078" target="_blank" rel="noopener noreferrer">
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        WhatsApp
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border/50 hover:border-primary/50 transition-colors duration-300">
                    <CardContent className="p-8">
                        <div className="flex flex-col h-full justify-between gap-6">
                            <div>
                                <div className="p-3 bg-secondary rounded-xl w-fit mb-4">
                                    <FileText className="w-6 h-6 text-foreground" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{lang === 'es' ? 'Información Importante' : 'Important Information'}</h3>
                                <p className="text-muted-foreground">
                                    {lang === 'es'
                                        ? 'Consulta nuestras políticas de servicio, términos y condiciones para el transporte de vehículos.'
                                        : 'Check our service policies, terms and conditions for vehicle transportation.'}
                                </p>
                            </div>
                            <Button variant="outline" asChild className="w-full border-primary/20 hover:bg-primary/5">
                                <Link href={`/${lang}/coordinacion-arrastres`}>
                                    {lang === 'es' ? 'Ver Políticas de Servicio' : 'View Service Policies'}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Disclaimer */}
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-center text-xs text-muted-foreground/60 max-w-3xl mx-auto"
            >
                {dict.towing_rates?.disclaimer}
            </motion.p>
        </div>
    );
}
