'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';

type CarVideoPlayerProps = {
  videoUrl: string;
};

export default function CarVideoPlayer({ videoUrl }: CarVideoPlayerProps) {
  return (
    <Card className="bg-secondary/50">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Video de Inspección
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full overflow-hidden rounded-lg border">
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
            playsInline
          >
            Tu navegador no soporta el tag de video.
          </video>
        </div>
      </CardContent>
    </Card>
  );
}
