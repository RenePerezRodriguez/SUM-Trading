'use client';

import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { geoCentroid } from 'd3-geo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Info } from 'lucide-react';
import { usePathname } from 'next/navigation';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// Tarifas por estado basadas en el Excel EXACTO
const towingRates: Record<string, { cities: Array<{ name: string; price: number }> }> = {
    Arkansas: {
        cities: [
            { name: 'Fayetteville - LINCOLN', price: 575 },
            { name: 'Fayetteville - PRAIRIE GROVE', price: 575 },
            { name: 'Little Rock - CONWAY', price: 500 },
            { name: 'Little Rock - SCOTT', price: 500 },
        ]
    },
    Arizona: {
        cities: [
            { name: 'Phoenix', price: 850 },
            { name: 'Tucson', price: 925 },
        ]
    },
    Texas: {
        cities: [
            { name: 'Abilene', price: 525 },
            { name: 'Amarillo', price: 625 },
            { name: 'Andrews', price: 625 },
            { name: 'Austin', price: 425 },
            { name: 'Corpus Christi', price: 350 },
            { name: 'Dallas - GRAND PRAIRIE', price: 450 },
            { name: 'Dallas - WILMER', price: 450 },
            { name: 'Dallas/Ft Worth', price: 450 },
            { name: 'El Paso - ANTHONY', price: 600 },
            { name: 'El Paso - EL PASO', price: 600 },
            { name: 'Fort Worth North - JUSTIN', price: 470 },
            { name: 'Ft. Worth - HASLET', price: 430 },
            { name: 'Houston', price: 250 },
            { name: 'Houston East', price: 250 },
            { name: 'Houston South - ROSHARON', price: 260 },
            { name: 'Houston-North - HOUSTON', price: 250 },
            { name: 'Longview', price: 425 },
            { name: 'Lubbock', price: 625 },
            { name: 'Lufkin', price: 425 },
            { name: 'McAllen - DONNA', price: 450 },
            { name: 'McAllen - MERCEDES', price: 450 },
            { name: 'Permian Basin - ODESSA', price: 625 },
            { name: 'San Antonio', price: 350 },
            { name: 'San Antonio South', price: 350 },
            { name: 'Waco - TEMPLE', price: 400 },
        ]
    },
    Idaho: {
        cities: [
            { name: 'Boise - MERIDIAN', price: 1250 },
            { name: 'Boise - NAMPA', price: 1225 },
        ]
    },
    Iowa: {
        cities: [
            { name: 'DAVENPORT', price: 1050 },
            { name: 'Davenport - ELDRIDGE', price: 1050 },
            { name: 'Des Moines - DE SOTO', price: 850 },
            { name: 'Des Moines - DES MOINES', price: 850 },
        ]
    },
    Kansas: {
        cities: [
            { name: 'Kansas City', price: 750 },
            { name: 'Kansas City Sublot', price: 725 },
            { name: 'Wichita - PARK CITY', price: 700 },
            { name: 'Wichita - WICHITA', price: 700 },
        ]
    },
    Louisiana: {
        cities: [
            { name: 'Baton Rouge - LIVINGSTON', price: 500 },
            { name: 'Lafayette - LAFAYETTE', price: 450 },
            { name: 'New Orleans - COVINGTON', price: 525 },
            { name: 'New Orleans - NEW ORLEANS', price: 525 },
            { name: 'Shreveport - GREENWOOD', price: 475 },
            { name: 'Shreveport - SHREVEPORT', price: 475 },
        ]
    },
    Missouri: {
        cities: [
            { name: 'Bridgeton Sublot', price: 845 },
            { name: 'Columbia', price: 850 },
            { name: 'Kansas City - ODESSA', price: 850 },
            { name: 'Sikeston', price: 825 },
            { name: 'Springfield - ROGERSVILLE', price: 850 },
            { name: 'Springfield - SPRINGFIELD', price: 850 },
            { name: 'Springfield Sub Lot', price: 900 },
            { name: 'St Louis - Dunn Sublot', price: 875 },
            { name: 'St Louis - BRIDGETON', price: 845 },
        ]
    },
    Illinois: {
        cities: [
            { name: 'Lincoln', price: 1200 },
            { name: 'Peoria', price: 1200 },
            { name: 'Southern Illinois - ALORTON', price: 700 },
            { name: 'St Louis - GRANITE CITY', price: 750 },
            { name: 'Wheeling', price: 975 },
        ]
    },
    Colorado: {
        cities: [
            { name: 'Colorado Springs', price: 870 },
            { name: 'Denver - BRIGHTON', price: 845 },
            { name: 'Denver - DENVER', price: 845 },
            { name: 'Denver East - COMMERCE CITY', price: 900 },
        ]
    },
    'New Mexico': {
        cities: [
            { name: 'Albuquerque', price: 770 },
        ]
    },
    Oklahoma: {
        cities: [
            { name: 'Moore Sublot', price: 630 },
            { name: 'Portland Sublot', price: 630 },
            { name: 'Tulsa', price: 630 },
        ]
    },
    Nebraska: {
        cities: [
            { name: 'Lincoln', price: 900 },
            { name: 'Omaha', price: 885 },
        ]
    }
};

const stateAbbreviations: Record<string, string> = {
    'Alabama': 'AL',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
};

// Obtener precio promedio por estado
const getAveragePrice = (state: string): number => {
    const stateData = towingRates[state];
    if (!stateData) return 0;
    const total = stateData.cities.reduce((sum, city) => sum + city.price, 0);
    return Math.round(total / stateData.cities.length);
};

// Colores basados en precio
const getPriceColor = (price: number): string => {
    if (price === 0) return '#e5e7eb'; // gray-200
    if (price < 400) return '#22c55e'; // green-500
    if (price < 600) return '#eab308'; // yellow-500
    if (price < 800) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
};

export default function TowingRatesMap({ dict }: { dict?: any }) {
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const pathname = usePathname();
    const lang = pathname.split('/')[1];

    // Fallback texts if dict is not provided or missing keys
    const t = {
        title: dict?.towing_rates?.title || "Tarifas de Arrastre por Estado",
        description: dict?.towing_rates?.description || "Consulta nuestras tarifas de transporte terrestre desde diferentes ubicaciones en Estados Unidos hasta Brownsville, Texas",
        hover_prompt: dict?.towing_rates?.hover_prompt || "Pasa el cursor sobre un estado para ver las tarifas",
        average: dict?.towing_rates?.average || "Promedio",
        price_range_1: dict?.towing_rates?.price_range_1 || "$250-$400",
        price_range_2: dict?.towing_rates?.price_range_2 || "$400-$600",
        price_range_3: dict?.towing_rates?.price_range_3 || "$600-$800",
        price_range_4: dict?.towing_rates?.price_range_4 || "$800+",
        disclaimer: dict?.towing_rates?.disclaimer || "* Las tarifas pueden variar según condiciones climáticas, temporada alta, cierres de carreteras o aumento de combustible.",
        view_policies: "Ver Políticas de Arrastre",
        suv_surcharge: "Nota: Pickups + SUV (3 Filas) tienen un cargo adicional de $100 USD."
    };

    return (
        <div className="py-16 bg-gradient-to-b from-background to-muted/20">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
                        {t.title}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                        {t.description}
                    </p>

                    {/* Botón a Políticas */}
                    <Button asChild variant="outline" className="gap-2">
                        <Link href={`/${lang}/coordinacion-arrastres`}>
                            <FileText className="w-4 h-4" />
                            {t.view_policies}
                        </Link>
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Mapa */}
                    <Card className="lg:col-span-2 p-6 relative overflow-hidden">
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
                                                    onMouseEnter={() => setSelectedState(stateName)}
                                                    onMouseLeave={() => setSelectedState(null)}
                                                    style={{
                                                        default: {
                                                            fill: isSelected ? '#3b82f6' : getPriceColor(avgPrice),
                                                            stroke: '#fff',
                                                            strokeWidth: 0.75,
                                                            outline: 'none',
                                                        },
                                                        hover: {
                                                            fill: '#3b82f6',
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

                                            // Only show label if we have a price for it
                                            if (!abbr || avgPrice === 0) return null;

                                            return (
                                                <Marker key={`${geo.rsmKey}-marker`} coordinates={centroid}>
                                                    <text
                                                        y="2"
                                                        fontSize={10}
                                                        textAnchor="middle"
                                                        fill="#fff"
                                                        style={{ pointerEvents: "none", fontWeight: "bold", textShadow: "0px 0px 2px rgba(0,0,0,0.5)" }}
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

                        {/* Leyenda */}
                        <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }} />
                                <span>{t.price_range_1}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }} />
                                <span>{t.price_range_2}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }} />
                                <span>{t.price_range_3}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }} />
                                <span>{t.price_range_4}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Información del estado seleccionado */}
                    <div className="flex flex-col gap-4">
                        <Card className="p-6 flex-1">
                            {selectedState && towingRates[selectedState] ? (
                                <div className="h-full flex flex-col">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        {selectedState}
                                        <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                            {stateAbbreviations[selectedState]}
                                        </span>
                                    </h3>
                                    <div className="space-y-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                        {towingRates[selectedState].cities.map((city) => (
                                            <div key={city.name} className="flex justify-between items-center py-2 border-b last:border-0">
                                                <span className="text-sm">{city.name}</span>
                                                <span className="font-semibold text-primary">${city.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-auto pt-4 border-t">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">{t.average}:</span>
                                            <span className="text-lg font-bold text-primary">
                                                ${getAveragePrice(selectedState)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-12">
                                    <Info className="w-12 h-12 mb-4 opacity-20" />
                                    <p>{t.hover_prompt}</p>
                                </div>
                            )}
                        </Card>

                        {/* Nota de recargo */}
                        <Card className="p-4 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
                            <p className="text-sm text-amber-800 dark:text-amber-400 font-medium flex gap-2">
                                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                {t.suv_surcharge}
                            </p>
                        </Card>
                    </div>
                </div>

                {/* Nota */}
                <p className="text-center text-sm text-muted-foreground mt-8">
                    {t.disclaimer}
                </p>
            </div>
        </div>
    );
}
