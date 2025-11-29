'use client';

import React from 'react';
import type { Car } from '@/lib/placeholder-data';
import { Card } from '@/components/ui/card';
import CarListItemImage from './car-list-item-image';
import CarListItemDetails from './car-list-item-details';
import CarListItemFooter from './car-list-item-footer';

type CarListItemProps = {
  car: Car;
  lang: string;
  dict: any;
};

export default function CarListItem({ car, lang, dict }: CarListItemProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group w-full">
      {/* Container principal. Block por defecto, flex en escritorio. */}
      <div className="block md:flex">
        {/* Contenedor de la imagen */}
        <div className="md:w-1/3">
          <CarListItemImage car={car} lang={lang} dict={dict} />
        </div>
        
        {/* Contenedor de los detalles */}
        <div className="md:w-2/3">
          {/* Contenedor interno para padding y alineación vertical */}
          <div className="p-6 flex flex-col h-full">
            <CarListItemDetails car={car} lang={lang} dict={dict} />
            <div className="mt-auto"> {/* Empuja el footer hacia abajo */}
              <CarListItemFooter car={car} lang={lang} dict={dict} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
