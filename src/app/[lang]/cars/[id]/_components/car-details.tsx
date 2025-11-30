
import { Badge } from '@/components/ui/badge';
import type { Car } from '@/lib/placeholder-data';
import CarVideoPlayer from './car-video-player';
import { Copy, Fingerprint, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type CarDetailsProps = {
  car: Car;
};

export default function CarDetails({ car }: CarDetailsProps) {
  const { toast } = useToast();
  const vehicleType = car.type === 'Other' && car.otherType ? car.otherType : car.type;
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: `${label} copiado al portapapeles`,
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="rounded-sm border-primary/50 text-primary font-mono">
            {car.year}
        </Badge>
        {car.engineStatus === 'Runs and Drives' && (
            <Badge variant="default" className="bg-green-600 hover:bg-green-700 rounded-sm">Run & Drive</Badge>
        )}
        {car.titleType === 'Clean Title' && (
            <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 rounded-sm">Clean Title</Badge>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl font-black tracking-tighter font-headline uppercase text-foreground">
        {car.make} {car.model}
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-border/60">
        <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Hash className="w-3 h-3" /> Lote
            </span>
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => copyToClipboard(car.lotNumber || '', 'Lote')}>
                <span className="font-mono text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {car.lotNumber}
                </span>
                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
            </div>
        </div>
        <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Fingerprint className="w-3 h-3" /> VIN
            </span>
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => copyToClipboard(car.vin || '', 'VIN')}>
                <span className="font-mono text-lg font-bold text-foreground group-hover:text-primary transition-colors break-all">
                    {car.vin}
                </span>
                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
            </div>
        </div>
      </div>

      <p className="text-lg capitalize text-muted-foreground">
        {vehicleType} • {car.color}
      </p>
      
      <p className="text-muted-foreground text-sm leading-relaxed border-l-2 border-primary/20 pl-4">
        {car.description}
      </p>
      
      {car.video && <CarVideoPlayer videoUrl={car.video.url} />}
    </div>
  );
}
