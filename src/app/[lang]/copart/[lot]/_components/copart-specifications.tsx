
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, Calendar, Wrench, Palette, Cog, Waypoints, FileText, KeyRound, AlertTriangle, ShieldQuestion, Car as CarIcon, Fuel, GitCommit, Hash, CircleDollarSign, Sparkles, MapPin } from 'lucide-react';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';

const SpecificationItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | null | undefined }) => {
    if (!value) return null;
    return (
        <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                <Icon className="w-5 h-5"/>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className="font-semibold break-words">{value}</div>
            </div>
        </div>
    );
};

export default function CopartSpecifications({ vehicle, dict }: { vehicle: NormalizedVehicle, dict: any }) {
    const t = dict.car_details;
    
    // Helper to parse price values (can be string "$1,234", number, or "N/A")
    const parsePrice = (value: string | number | null | undefined): number | null => {
        if (!value) return null;
        if (typeof value === 'number') return value > 0 ? value : null;
        if (typeof value === 'string') {
            if (value === 'N/A' || value.trim() === '') return null;
            const cleaned = value.replace(/[$,]/g, '');
            const parsed = parseFloat(cleaned);
            return isNaN(parsed) || parsed <= 0 ? null : parsed;
        }
        return null;
    };
    
    const retailValue = parsePrice(vehicle.estimated_retail_value);
    const currentBid = parsePrice(vehicle.current_bid);
    const buyNow = parsePrice(vehicle.buy_it_now_price);
    
    const formattedRetailValue = retailValue 
        ? new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(retailValue)
        : null;

    const formattedCurrentBid = currentBid 
        ? new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(currentBid)
        : null;

    const formattedBuyNow = buyNow 
        ? new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(buyNow)
        : null;

    const currentBidLabel = dict?.common?.vehicle_comparator?.current_bid || 'Current Bid';
    const specifications = [
        { label: 'VIN', value: vehicle.vin, icon: Fingerprint },
        { label: dict?.common?.vehicle_comparator?.location || 'Location', value: vehicle.location, icon: MapPin },
        { label: currentBidLabel, value: formattedCurrentBid, icon: CircleDollarSign },
        { label: dict?.common?.vehicle_comparator?.buy_now || 'Buy It Now Price', value: formattedBuyNow, icon: CircleDollarSign },
        { label: dict?.common?.vehicle_comparator?.retail_value || 'Est. Retail Value', value: formattedRetailValue, icon: Sparkles },
        { label: t.mileage, value: vehicle.odometer, icon: Waypoints },
        { label: 'Documento', value: vehicle.doc_type, icon: FileText },
        { label: 'Daño Primario', value: vehicle.primary_damage, icon: AlertTriangle },
        { label: 'Daño Secundario', value: vehicle.secondary_damage, icon: AlertTriangle },
        { label: 'Condición', value: vehicle.condition, icon: ShieldQuestion },
        { label: 'Tiene Llaves', value: vehicle.keys, icon: KeyRound },
        { label: t.engine, value: vehicle.engine_type, icon: Wrench },
        { label: t.transmission, value: vehicle.transmission, icon: Cog },
        { label: t.color, value: vehicle.color, icon: Palette },
        { label: 'Tracción', value: vehicle.drive, icon: CarIcon },
        { label: 'Combustible', value: vehicle.fuel, icon: Fuel },
        { label: 'Cilindros', value: vehicle.cylinders, icon: GitCommit },
    ];

    return (
        <Card className="bg-secondary/50">
            <CardHeader>
                <CardTitle className="font-headline">{t.specifications}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {specifications.map(spec => (
                   <SpecificationItem key={spec.label} icon={spec.icon} label={spec.label} value={spec.value} />
                ))}
            </CardContent>
        </Card>
    );
}
