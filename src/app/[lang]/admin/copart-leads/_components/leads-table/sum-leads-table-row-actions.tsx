'use client';

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { SumLead } from "@/lib/schemas";
import { Car, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { parsePhoneNumber } from "libphonenumber-js";


interface SumLeadsTableRowActionsProps {
  lead: SumLead;
  onStatusChange: (status: 'active' | 'in-progress' | 'finished') => void;
  dict: any;
}

export function SumLeadsTableRowActions({
  lead,
  onStatusChange,
  dict
}: SumLeadsTableRowActionsProps) {
  const currentStatus = lead.status || 'active';
  const vehicles = lead.vehicles || [];
  
  const getWhatsAppLink = () => {
    if (!lead.user?.phoneNumber) return '#';
    try {
        const phoneNumber = parsePhoneNumber(lead.user.phoneNumber);
        const internationalNumber = phoneNumber.format('E.164').replace('+', '');
        const message = encodeURIComponent(dict.admin_leads_page.whatsapp_message_sum.replace('{name}', lead.user.names));
        return `https://wa.me/${internationalNumber}?text=${message}`;
    } catch(e) {
        console.error("Could not parse phone number:", e);
        return `https://wa.me/${lead.user.phoneNumber.replace(/\D/g, '')}`;
    }
  };

  const handleContactClick = () => {
    if (currentStatus === 'active') {
        onStatusChange('in-progress');
    }
  };

  return (
    <div className="flex items-center gap-2">
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8" disabled={vehicles.length === 0}>
                    <Car className="mr-2 h-4 w-4" />
                    Ver ({vehicles.length})
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-80 overflow-y-auto p-2">
                <div className="space-y-2">
                    {vehicles.map((item, index) => {
                        const vehicleUrl = `/${dict.lang.substring(0, 2)}/cars/${item.id}`;
                        return (
                            <Link key={index} href={vehicleUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary">
                            <div className="relative w-16 h-12 rounded-sm overflow-hidden bg-secondary flex-shrink-0">
                                <Image src={item.imageUrl || 'https://placehold.co/128x96'} alt={item.model} fill className="object-cover" />
                            </div>
                            <div className="text-xs">
                                <p className="font-semibold truncate">{item.make} {item.model}</p>
                                <p className="text-muted-foreground">VIN: {item.vin}</p>
                            </div>
                            </Link>
                        );
                        })}
                </div>
            </PopoverContent>
        </Popover>
        
        <Button asChild variant="outline" size="sm" className="h-8">
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" onClick={handleContactClick}>
                <Phone className="mr-2 h-4 w-4" />
                Contactar
            </a>
        </Button>
    </div>
  );
}
