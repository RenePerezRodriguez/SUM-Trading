
import { Badge } from '@/components/ui/badge';
import type { Car } from '@/lib/placeholder-data';
import CarVideoPlayer from './car-video-player';

type CarDetailsProps = {
  car: Car;
};

export default function CarDetails({ car }: CarDetailsProps) {
  const vehicleType = car.type === 'Other' && car.otherType ? car.otherType : car.type;
  
  return (
    <div>
      <Badge variant="secondary" className="mb-2 w-fit">{car.year}</Badge>
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
        {car.make} {car.model}
      </h1>
      <p className="text-lg capitalize text-muted-foreground mb-4">{vehicleType}</p>
      <p className="text-muted-foreground mb-6 text-lg">
        {car.description}
      </p>
      {car.video && <CarVideoPlayer videoUrl={car.video.url} />}
    </div>
  );
}
