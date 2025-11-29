
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Car } from '@/lib/placeholder-data';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type ComparisonTableProps = {
  cars: Car[];
  dict: any;
  lang: string;
};

const findBestValue = (cars: Car[], key: keyof Car, direction: 'asc' | 'desc'): number | null => {
    if (!cars || cars.length === 0) return null;
    const values = cars.map(car => car[key] as number).filter(v => typeof v === 'number' && !isNaN(v));
    if (values.length === 0) return null;
    return direction === 'asc' ? Math.min(...values) : Math.max(...values);
};
  
const TableSpecRow = ({ label, cars, carKey, format, bestDirection }: { label: string, cars: Car[], carKey: keyof Car, format?: (value: any) => string, bestDirection?: 'asc' | 'desc' }) => {
    const bestValue = bestDirection ? findBestValue(cars, carKey, bestDirection) : null;
    
    return (
      <TableRow>
        <TableCell className="font-semibold">{label}</TableCell>
        {cars.map(car => {
          const value = car[carKey];
          const isBest = bestValue !== null && value === bestValue;
          const formattedValue = format ? format(value) : String(value);

          return (
            <TableCell key={car.id} className={cn('min-w-[150px]', isBest && 'bg-primary/10')}>
              <span className={cn(isBest && 'font-bold text-primary')}>
                {formattedValue}
              </span>
            </TableCell>
          );
        })}
      </TableRow>
    );
};

export default function ComparisonTable({ cars, dict, lang }: ComparisonTableProps) {
    const formatCurrency = (value: number) => new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    const formatNumber = (value: number) => new Intl.NumberFormat(lang).format(value);
  
    const specRows = [
      { key: 'price', label: dict.car_details.price, format: formatCurrency, bestDirection: 'asc' },
      { key: 'year', label: dict.car_details.year, bestDirection: 'desc' },
      { key: 'mileage', label: dict.car_details.mileage, format: formatNumber, bestDirection: 'asc' },
      { key: 'horsepower', label: dict.car_details.horsepower, bestDirection: 'desc' },
      { key: 'engine', label: dict.car_details.engine },
      { key: 'transmission', label: dict.car_details.transmission },
      { key: 'color', label: dict.car_details.color },
      { key: 'type', label: dict.car_catalog.type_filter_title },
    ] as const;

    if (!cars || cars.length === 0) {
        return <p className="text-center text-muted-foreground py-8">{dict.car_catalog.no_results_compare}</p>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-40">{dict.car_details.specifications}</TableHead>
                    {cars.map(car => {
                        const mainImage = car.images && car.images.length > 0 ? car.images[0] : null;
                        return (
                            <TableHead key={car.id}>
                                <Link href={`/${lang}/cars/${car.id}`} className="hover:underline">
                                    <div className="w-40 sm:w-48">
                                        {mainImage ? (
                                            <Image 
                                                src={mainImage.url} 
                                                alt={`${car.make} ${car.model}`}
                                                width={192}
                                                height={144}
                                                className="rounded-md object-cover aspect-[4/3] mb-2"
                                                data-ai-hint={mainImage.hint}
                                            />
                                        ) : (
                                            <div className="rounded-md object-cover aspect-[4/3] mb-2 bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                                                Sin imagen
                                            </div>
                                        )}
                                        <p className="font-bold">{car.make} {car.model}</p>
                                    </div>
                                </Link>
                            </TableHead>
                        )
                    })}
                </TableRow>
            </TableHeader>
            <TableBody>
                {specRows.map(row => (
                    <TableSpecRow
                        key={row.key}
                        label={row.label}
                        cars={cars}
                        carKey={row.key}
                        format={'format' in row ? row.format : undefined}
                        bestDirection={'bestDirection' in row ? row.bestDirection : undefined}
                    />
                ))}
                 <TableRow>
                    <TableCell></TableCell>
                    {cars.map(car => (
                        <TableCell key={car.id}>
                             <Button asChild size="sm">
                                <Link href={`/${lang}/cars/${car.id}`}>
                                    {dict.car_catalog.view_details}
                                </Link>
                            </Button>
                        </TableCell>
                    ))}
                </TableRow>
            </TableBody>
        </Table>
    );
}
