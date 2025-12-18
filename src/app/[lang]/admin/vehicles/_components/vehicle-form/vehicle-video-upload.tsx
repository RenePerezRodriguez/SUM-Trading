
'use client';

import { useState, useRef, useEffect } from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload, X, Video } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface VehicleVideoUploadProps {
  dict: any;
  uploadProgress: number | null;
  existingVideoUrl?: string;
}

export default function VehicleVideoUpload({ dict, uploadProgress, existingVideoUrl }: VehicleVideoUploadProps) {
  const { control, setValue, watch } = useFormContext();
  const videoFieldValue = watch('videoFile');
  
  const [preview, setPreview] = useState<string | null>(existingVideoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (videoFieldValue instanceof File) {
        setPreview(URL.createObjectURL(videoFieldValue));
    } else if (typeof videoFieldValue === 'object' && videoFieldValue?.url) {
        setPreview(videoFieldValue.url);
    } else {
        setPreview(existingVideoUrl || null);
    }
  }, [videoFieldValue, existingVideoUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setValue('videoFile', file || null, { shouldDirty: true });
  };

  const clearVideo = () => {
    setValue('videoFile', null, { shouldDirty: true });
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <FormItem>
        <FormLabel>{dict.fields.video}</FormLabel>
        <FormControl>
          <div className="w-full">
            {preview ? (
              <div className="relative w-full">
                <video src={preview} controls className="rounded-lg w-full aspect-video bg-black" />
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full z-10" onClick={clearVideo}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:bg-muted/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Video className="h-8 w-8 mb-2" />
                <span>{dict.fields.video_cta}</span>
                <span className="text-xs mt-1">{dict.fields.video_size_note}</span>
              </div>
            )}
            <Input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/mp4,video/quicktime"
            />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
      {uploadProgress !== null && (
        <div className="space-y-2 mt-4">
            <Label>{dict.fields.uploading_video}</Label>
            <Progress value={uploadProgress} />
        </div>
      )}
    </div>
  );
}
