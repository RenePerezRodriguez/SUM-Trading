
'use client';

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { UserProfile } from "@/lib/user-profile";
import { Car, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { parsePhoneNumber } from "libphonenumber-js";


interface LeadsTableRowActionsProps {
  user: UserProfile;
  onStatusChange: (user: UserProfile, status: 'active' | 'in-progress' | 'finished') => void;
  dict: any;
}

export function LeadsTableRowActions({
  user,
  onStatusChange,
  dict
}: LeadsTableRowActionsProps) {
  const currentStatus = user.copartConsultation?.status || 'active';
  const purchaseItems = user.copartConsultation?.purchase?.items || [];
  
  const getWhatsAppLink = () => {
    if (!user.phoneNumber) return '#';
    try {
        const phoneNumber = parsePhoneNumber(user.phoneNumber);
        const internationalNumber = phoneNumber.format('E.164').replace('+', '');
        const message = encodeURIComponent(`Hola ${user.names}, te contacto de parte de SUM Trading sobre tu consulta de asesoría para vehículos de Copart.`);
        return `https://wa.me/${internationalNumber}?text=${message}`;
    } catch(e) {
        console.error("Could not parse phone number:", e);
        return `https://wa.me/${user.phoneNumber.replace(/\D/g, '')}`;
    }
  };

  const handleContactClick = () => {
    // Automatically change status to 'in-progress' when contact is initiated
    if (currentStatus === 'active') {
        onStatusChange(user, 'in-progress');
    }
    // The link will be followed by the browser's default behavior
  };

  return (
    <div className="flex items-center gap-2">
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8" disabled={purchaseItems.length === 0}>
                    <Car className="mr-2 h-4 w-4" />
                    Ver ({purchaseItems.length})
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-80 overflow-y-auto p-2">
                <div className="space-y-2">
                    {purchaseItems.map((item, index) => {
                        const copartUrl = `https://www.copart.com/lot/${item.image?.id}`;
                        return (
                            <Link key={index} href={copartUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary">
                            <div className="relative w-16 h-12 rounded-sm overflow-hidden bg-secondary flex-shrink-0">
                                <Image src={item.image?.url || 'https://placehold.co/128x96'} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="text-xs">
                                <p className="font-semibold truncate">{item.name}</p>
                                <p className="text-muted-foreground">Lote: {item.image?.id}</p>
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
