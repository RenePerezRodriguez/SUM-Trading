
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Car } from '@/lib/placeholder-data';
import { Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

type CostCalculatorProps = {
  car: Car;
  dict: any;
  lang: string;
};

// Realistic cost settings
const costSettings = {
    US: { 
        name: 'United States', 
        importTaxRate: 0, 
        transport: { base: 500, insuranceRate: 0.005 }, // Local transport
        fees: 250 
    },
    MX: { 
        name: 'Mexico', 
        importTaxRate: 0.16, // IVA
        transport: { base: 1500, insuranceRate: 0.01 }, // International transport
        fees: 850 
    },
};

const getCommission = (price: number): { rate: number, amount: number } => {
    if (price <= 50000) {
        const rate = 0.10; // 10%
        return { rate, amount: price * rate };
    }
    const rate = 0.08; // 8% for cars over 50k
    return { rate, amount: price * rate };
}

export default function CostCalculator({ car, dict, lang }: CostCalculatorProps) {
  const [selectedCountry, setSelectedCountry] = useState('MX');
  
  const content = dict.cost_calculator;
  const basePrice = car.price;

  const countryData = costSettings[selectedCountry as keyof typeof costSettings];
  
  const commission = getCommission(basePrice);
  const transport = countryData.transport.base + (basePrice * countryData.transport.insuranceRate);
  const subtotalBeforeTaxes = basePrice + commission.amount + transport;
  const importTaxes = subtotalBeforeTaxes * countryData.importTaxRate;
  const managementFees = countryData.fees;
  const total = subtotalBeforeTaxes + importTaxes + managementFees;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' }).format(value);
  };

  const costItems = [
    { label: content.car_price, value: basePrice },
    { label: `${content.commission} (${commission.rate * 100}%)`, value: commission.amount },
    { label: content.transport, value: transport },
    ...(countryData.importTaxRate > 0 ? [{ label: `${content.import_taxes} (${countryData.importTaxRate * 100}%)`, value: importTaxes }] : []),
    { label: content.management_fees, value: managementFees },
  ];

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
    >
        <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                {content.title}
            </CardTitle>
            <CardDescription>{content.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-6">
                <Label htmlFor="country-select">{content.select_country}</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger id="country-select">
                        <SelectValue placeholder={content.select_country} />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(costSettings).map(([code, data]) => (
                            <SelectItem key={code} value={code}>{data.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <Table>
                <TableBody>
                    {costItems.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="text-muted-foreground">{item.label}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(item.value)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow className="bg-secondary/50 hover:bg-secondary/70">
                        <TableHead className="text-lg font-bold">{content.total_title}</TableHead>
                        <TableHead className="text-right text-2xl font-bold text-primary">{formatCurrency(total)}</TableHead>
                    </TableRow>
                </TableFooter>
            </Table>
            <p className="text-xs text-muted-foreground mt-4">{content.disclaimer}</p>
        </CardContent>
        </Card>
    </motion.div>
  );
}

