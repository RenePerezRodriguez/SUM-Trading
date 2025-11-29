
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export default function LogisticsMap() {
  const [activeLocation, setActiveLocation] = useState<'texas' | 'mexico'>('texas');
  
  const maps = {
    texas: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3587.080885112153!2d-97.3719188!3d25.965387500000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x649c4cada4edd39b%3A0xc4c210a2282b2744!2sSUM%20Trading%20%26%20Repair%20Services!5e0!3m2!1ses-419!2sbo!4v1761622031260!5m2!1ses-419!2sbo",
    mexico: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3752.8967431886596!2d-98.7513247!3d20.1203906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1a0e5e5e5e5e5%3A0x5e5e5e5e5e5e5e5e!2sBlvd.%20Felipe%20%C3%81ngeles%20710%2C%20Zona%20Plateada%2C%2042084%20Pachuca%20de%20Soto%2C%20Hgo.!5e0!3m2!1ses-419!2smx!4v1731622031260!5m2!1ses-419!2smx"
  };

  return (
    <div className="relative h-full w-full">
      {/* Location Toggle Buttons */}
      <div className="absolute top-2 left-2 right-2 z-10 flex gap-2">
        <Button
          size="sm"
          variant={activeLocation === 'texas' ? 'default' : 'secondary'}
          onClick={() => setActiveLocation('texas')}
          className="flex-1 transition-all duration-200 hover:scale-105 shadow-md"
        >
          <MapPin className="h-3 w-3 mr-1" />
          Texas
        </Button>
        <Button
          size="sm"
          variant={activeLocation === 'mexico' ? 'default' : 'secondary'}
          onClick={() => setActiveLocation('mexico')}
          className="flex-1 transition-all duration-200 hover:scale-105 shadow-md"
        >
          <MapPin className="h-3 w-3 mr-1" />
          México
        </Button>
      </div>
      
      {/* Map iframes */}
      <iframe
        key={activeLocation}
        src={maps[activeLocation]}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Ubicación de SUM Trading - ${activeLocation === 'texas' ? 'Brownsville, TX' : 'Pachuca, Hidalgo'}`}
        className="animate-in fade-in duration-300"
      ></iframe>
    </div>
  );
}
