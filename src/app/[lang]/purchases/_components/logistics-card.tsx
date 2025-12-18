'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogisticsTimeline } from './logistics-timeline';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, Download, ExternalLink, Car, Box } from 'lucide-react';
import type { PurchaseRecord } from '@/lib/schemas';
import type { Locale } from '@/lib/i18n-config';

interface LogisticsCardProps {
  purchase: PurchaseRecord;
  lang: Locale;
  dict: any;
}

export function LogisticsCard({ purchase, lang, dict }: LogisticsCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(lang, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return "N/A";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Mock status for now - in a real app this would come from the DB
  const status = 'processing'; 

  return (
    <div className="border border-border bg-background shadow-sm overflow-hidden group">
      {/* Header - Manifest Style */}
      <div className="bg-secondary/30 border-b border-border p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-sm">
            <Box className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">ID de Orden</p>
            <p className="font-mono font-bold text-lg leading-none">#{purchase.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
            <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground text-right">Fecha</p>
                <p className="font-medium text-sm">{formatDate(purchase.purchaseDate)}</p>
            </div>
            <Badge variant="outline" className="bg-background rounded-sm px-3 py-1 border-primary/30 text-primary uppercase tracking-wide">
                {status}
            </Badge>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="px-6 py-6 border-b border-border/50 bg-background/50">
        <LogisticsTimeline status={status} />
      </div>

      {/* Content - Items List */}
      <div className="p-0">
        {purchase.items?.map((item: any, index: number) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border-b border-border/50 last:border-0 hover:bg-secondary/10 transition-colors">
            {/* Image */}
            <div className="relative w-full md:w-32 aspect-video bg-secondary rounded-sm overflow-hidden border border-border">
              {item.image?.url ? (
                <Image 
                  src={item.image.url} 
                  alt={item.name || 'Item'} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <Car className="w-6 h-6 opacity-20" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold font-headline text-lg">{item.name || `${item.make} ${item.model}`}</h4>
                <p className="text-sm text-muted-foreground font-mono">{item.description || item.year}</p>
                {item.vin && (
                    <p className="text-xs text-muted-foreground mt-1 font-mono">VIN: {item.vin}</p>
                )}
              </div>
              
              <div className="flex flex-col justify-center md:items-end">
                 <p className="text-sm text-muted-foreground">Precio Unitario</p>
                 <p className="font-bold">{formatCurrency(item.price)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer - Actions & Total */}
      <div className="bg-secondary/10 p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border">
        <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
                <FileText className="w-3 h-3" />
                Ver Factura
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-2">
                <ExternalLink className="w-3 h-3" />
                Soporte
            </Button>
        </div>
        
        <div className="flex items-center gap-4">
            <span className="text-sm uppercase tracking-wider text-muted-foreground font-bold">Total Pagado</span>
            <span className="text-xl font-black font-mono text-primary">{formatCurrency(purchase.total)}</span>
        </div>
      </div>
    </div>
  );
}
