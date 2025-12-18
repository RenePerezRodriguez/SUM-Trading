'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Car } from '@/lib/placeholder-data';
import ComparisonTable from './comparison-table';
import { ScrollArea } from '@/components/ui/scroll-area';

type ComparisonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  cars: Car[];
  dict: any;
  lang: string;
};

export default function ComparisonModal({ isOpen, onClose, cars, dict, lang }: ComparisonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95%] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl">{dict.car_catalog.compare_modal_title}</DialogTitle>
          <DialogDescription>{dict.car_catalog.compare_modal_desc}</DialogDescription>
        </DialogHeader>
        <div className="flex-grow mt-4 overflow-auto">
            <ComparisonTable cars={cars} dict={dict} lang={lang} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
