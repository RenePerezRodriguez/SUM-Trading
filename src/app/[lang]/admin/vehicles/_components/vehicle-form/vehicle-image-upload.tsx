
'use client';

import { useRef } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload, X, GripVertical, Expand } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Reorder } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface VehicleImageUploadProps {
  dict: any;
  uploadProgress: number | null;
}

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1920;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_WIDTH) {
            width *= MAX_WIDTH / height;
            height = MAX_WIDTH;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Could not get canvas context'));
        
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Canvas to Blob conversion failed'));
          
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }, 'image/jpeg', 0.85);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const RequiredIndicator = () => <span className="text-destructive ml-1">*</span>;

export default function VehicleImageUpload({ dict, uploadProgress }: VehicleImageUploadProps) {
  const { control, setValue, getValues } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "images",
    keyName: "key"
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (const file of Array.from(files)) {
        let fileToUpload = file;
        if (file.size > MAX_IMAGE_SIZE_BYTES) {
          toast({
            title: "Comprimiendo imagen...",
            description: `La imagen ${file.name} es grande. Se está optimizando.`,
          });
          try {
            fileToUpload = await compressImage(file);
          } catch (error) {
            console.error("Image compression failed:", error);
            toast({
              variant: 'destructive',
              title: "Error de compresión",
              description: `No se pudo comprimir la imagen ${file.name}.`,
            });
            continue;
          }
        }
        append({ file: fileToUpload, url: URL.createObjectURL(fileToUpload) });
      }
    }
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  
  return (
    <div className='space-y-4'>
        <FormItem>
            <FormLabel>{dict.fields.images}<RequiredIndicator /></FormLabel>
            <FormControl>
              <div 
                className="w-full min-h-[12rem] border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:bg-muted/50 p-4 gap-4"
                onClick={() => fileInputRef.current?.click()}
              >
                  <Upload className="h-8 w-8 mb-2" />
                  <span>{dict.fields.image_cta_multi}</span>
                  <span className="text-xs mt-1">{dict.fields.image_size_note}</span>
              </div>
            </FormControl>
             <Input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                multiple
              />
             <FormMessage />
        </FormItem>

        {fields.length > 0 && (
          <div className='mt-4'>
            <p className='text-sm font-medium text-muted-foreground mb-2'>{fields.length} {fields.length === 1 ? 'imagen' : 'imágenes'}. La primera es la principal. Arrastra para reordenar.</p>
            <Reorder.Group
              axis="x"
              values={fields}
              onReorder={(newOrder) => {
                const fromIndex = fields.findIndex(field => (field as any).key === (newOrder[0] as any).key);
                const toIndex = newOrder.findIndex(field => (field as any).key === (fields[0] as any).key);
                move(fromIndex, toIndex);
              }}
              className="flex flex-wrap gap-4"
            >
              {fields.map((field, index) => (
                <Reorder.Item key={(field as any).key} value={field}>
                  <Dialog>
                    <div className="relative w-40 h-32 group cursor-pointer">
                        <Image
                        src={(field as any).url}
                        alt={`Vista previa ${index + 1}`}
                        fill
                        className="rounded-lg object-cover"
                        sizes="160px"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <GripVertical className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5 text-white cursor-grab" />
                            
                            <DialogTrigger asChild>
                              <Button type="button" variant="outline" size="icon" className="h-7 w-7 rounded-full z-10 bg-black/50 border-white/50 text-white">
                                  <Expand className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>

                            <Button type="button" variant="destructive" size="icon" className="h-7 w-7 rounded-full z-10" onClick={(e) => {e.stopPropagation(); remove(index)}}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
                            Principal
                        </div>
                        )}
                    </div>
                    <DialogContent className="max-w-4xl h-[80vh] p-2">
                      <DialogHeader>
                          <DialogTitle className="sr-only">Vista previa de la imagen</DialogTitle>
                      </DialogHeader>
                      <Image src={(field as any).url} alt={`Vista previa ampliada ${index + 1}`} fill className="rounded-lg object-contain"/>
                    </DialogContent>
                  </Dialog>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        )}

      {uploadProgress !== null && (
        <div className="space-y-2 mt-4">
          <Label>{dict.fields.uploading_image}</Label>
          <Progress value={uploadProgress} />
        </div>
      )}
    </div>
  );
}
