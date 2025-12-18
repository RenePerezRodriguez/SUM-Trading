
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useStorage } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Car, CarImage } from '@/lib/placeholder-data';
import { createVehicleSchema } from '@/lib/schemas';
import { fetchNhtsaVinData } from '@/app/[lang]/admin/vehicles/actions';

type UseVehicleFormProps = {
    existingVehicle?: Car;
    lang: string;
    dict: any;
};

type FormImage = {
    id?: string;
    url: string;
    file?: File;
    hint?: string;
};

export default function useVehicleForm({ existingVehicle, lang, dict }: UseVehicleFormProps) {
    const isEditMode = !!existingVehicle;
    const vehicleSchema = createVehicleSchema(dict, isEditMode);

    const form = useForm<z.infer<typeof vehicleSchema>>({
        resolver: zodResolver(vehicleSchema) as any,
        defaultValues: isEditMode ? {
            ...(existingVehicle as any),
            year: existingVehicle?.year,
            price: existingVehicle?.price,
            mileage: existingVehicle?.mileage,
            horsepower: existingVehicle?.horsepower,
            cylinders: typeof (existingVehicle as any)?.cylinders === 'number' ? (existingVehicle as any).cylinders : undefined,
            estimatedRetailValue: typeof (existingVehicle as any)?.estimatedRetailValue === 'number' ? (existingVehicle as any).estimatedRetailValue : undefined,
            mileageUnit: (existingVehicle as any)?.mileageUnit || 'mi',
            drive: (existingVehicle as any)?.drive || '',
            fuel: existingVehicle?.fuel,
            titleCode: (existingVehicle as any)?.titleCode || '',
            lotNumber: (existingVehicle as any)?.lotNumber || '',
            highlights: (existingVehicle as any)?.highlights || '',
            damageDescription: (existingVehicle as any)?.damageDescription || '',
            otherType: (existingVehicle as any)?.otherType || '',
            otherTitleType: (existingVehicle as any)?.otherTitleType || '',
            otherPrimaryDamage: (existingVehicle as any)?.otherPrimaryDamage || '',
            otherSecondaryDamage: (existingVehicle as any)?.otherSecondaryDamage || '',
            secondaryDamage: (existingVehicle as any)?.secondaryDamage || 'None',
            status: existingVehicle?.status || 'Available',
            internalNotes: (existingVehicle as any)?.internalNotes || '',
            provenance: (existingVehicle as any)?.provenance || { country: '', city: '' },
        } : {
            make: '',
            model: '',
            vin: '',
            year: '' as any,
            price: '' as any,
            mileage: '' as any,
            horsepower: '' as any,
            description: '',
            mileageUnit: 'mi',
            engine: '',
            transmission: undefined,
            color: '',
            type: 'Sedan',
            otherType: '',
            status: 'Available',
            provenance: { country: '', city: '' },
            isFeatured: false,
            images: [],
            titleType: 'Clean Title',
            otherTitleType: '',
            damageDescription: '',
            primaryDamage: 'None',
            otherPrimaryDamage: '',
            secondaryDamage: 'None',
            otherSecondaryDamage: '',
            engineStatus: 'Starts',
            hasKeys: false,
            lotNumber: '',
            highlights: '',
            estimatedRetailValue: '' as any,
            cylinders: '' as any,
            drive: '',
            fuel: undefined,
            titleCode: '',
            internalNotes: '',
        },
    });

    const { toast } = useToast();
    const firestore = useFirestore();
    const storage = useStorage();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatusText, setSubmitStatusText] = useState('Guardando...');
    const [uploadProgress, setUploadProgress] = useState<{ type: 'image' | 'video', progress: number } | null>(null);
    const [isDecodingVin, setIsDecodingVin] = useState(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    const [rawVinData, setRawVinData] = useState<any | null>(null);
    const [isRawDataDialogOpen, setIsRawDataDialogOpen] = useState(false);

    const { watch, getValues, setValue, setFocus, formState } = form;
    const vinValue = watch('vin');
    const isVinValid = vinValue?.length === 17;

    useEffect(() => {
        if (isEditMode && existingVehicle) {
            const formValues = {
                ...existingVehicle,
                images: existingVehicle.images || [],
                videoFile: existingVehicle.video?.url ? { url: existingVehicle.video.url } : null,
            };
            form.reset(formValues as any);
        }
    }, [existingVehicle, isEditMode, form]);


    const handleFileUpload = (file: File, storage: any, onProgress: (progress: number) => void): Promise<CarImage> => {
        return new Promise((resolve, reject) => {
            const fileId = uuidv4();
            const fileExtension = file.name.split('.').pop() || 'tmp';
            const uniqueFileName = `${fileId}.${fileExtension}`;
            const storageRef = ref(storage, `cars/${uniqueFileName}`);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    onProgress(progress);
                },
                (error) => {
                    console.error("Upload failed:", error);
                    toast({
                        variant: "destructive",
                        title: "Upload Failed",
                        description: error.message,
                    });
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        const hint = `${getValues('color') || ''} ${getValues('make') || ''} ${getValues('model') || ''}`.trim();
                        resolve({ id: uniqueFileName, url: downloadURL, hint });
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    };

    const deleteOldFile = async (fileId?: string) => {
        if (!storage || !fileId) return;
        const oldFileRef = ref(storage, `cars/${fileId}`);
        try {
            await deleteObject(oldFileRef);
        } catch (error: any) {
            if (error.code !== 'storage/object-not-found') {
                console.warn(`Could not delete old file:`, error);
            }
        }
    };

    const handleDecodeVin = useCallback(async () => {
        const vin = getValues('vin');
        if (isDecodingVin || vin.length < 17) return;

        setIsDecodingVin(true);
        setRawVinData(null);
        try {
            const result = await fetchNhtsaVinData(vin);

            if (result.data) {
                setRawVinData(result.data);
            }

            if (result.success && result.decoded) {
                const { make, model, year } = result.decoded;
                let toastMessage = 'VIN decodificado.';
                let focusField: 'make' | 'model' | 'year' | null = null;

                if (make) {
                    setValue('make', make, { shouldValidate: true, shouldDirty: true });
                } else {
                    toastMessage += ' Marca no encontrada.';
                    focusField = 'make';
                }
                if (year) {
                    setValue('year', year, { shouldValidate: true, shouldDirty: true });
                } else {
                    toastMessage += ' Año no encontrado.';
                    if (!focusField) focusField = 'year';
                }
                if (model) {
                    setValue('model', model, { shouldValidate: true, shouldDirty: true });
                    toastMessage += ` ${year} ${make} ${model}.`;
                } else {
                    toastMessage += ' Por favor, introduce el modelo manualmente.';
                    if (!focusField) focusField = 'model';
                }

                toast({
                    title: "Decodificación de VIN",
                    description: toastMessage,
                });

                if (focusField) {
                    setFocus(focusField);
                }

            } else {
                throw new Error(result.error || dict.toast.vin_decode_error_desc);
            }
        } catch (error: any) {
            console.error("VIN decoding failed", error);
            toast({
                variant: 'destructive',
                title: dict.toast.vin_decode_error_title,
                description: error.message || dict.toast.vin_decode_error_desc,
            });
        } finally {
            setIsDecodingVin(false);
        }
    }, [getValues, isDecodingVin, setValue, toast, dict, setFocus]);

    const handleGenerateDescription = async () => {
        // This functionality is temporarily disabled.
        toast({
            variant: "destructive",
            title: "Función no disponible",
            description: "La generación de descripción con IA está temporalmente deshabilitada.",
        });
    };

    async function onSubmit(values: z.infer<typeof vehicleSchema>) {
        if (!firestore || !storage) return;
        setIsSubmitting(true);
        setSubmitStatusText('Subiendo imágenes...');

        try {
            const { images, videoFile, ...carData } = values;

            const uploadedImages = await Promise.all(
                images.map(async (img) => {
                    if (img.file instanceof File) {
                        const imageData = await handleFileUpload(img.file, storage, (p) => setUploadProgress({ type: 'image', progress: p }));
                        return imageData;
                    }
                    // It's an existing image, just return its data
                    return { id: img.id, url: img.url, hint: (img as any).hint || '' } as CarImage;
                })
            );
            setUploadProgress(null);

            // Cleanup: Delete images that were removed from the form
            if (isEditMode && existingVehicle?.images) {
                const currentImageIds = new Set(images.map(img => img.id).filter(Boolean));
                const imagesToDelete = existingVehicle.images.filter(img => !currentImageIds.has(img.id));
                await Promise.all(imagesToDelete.map(img => deleteOldFile(img.id)));
            }

            setSubmitStatusText('Subiendo video...');
            let videoPayload = existingVehicle?.video;
            if (videoFile instanceof File) {
                videoPayload = await handleFileUpload(videoFile, storage, (p) => setUploadProgress({ type: 'video', progress: p }));
                if (existingVehicle?.video?.id) {
                    await deleteOldFile(existingVehicle.video.id);
                }
            } else if (videoFile === null) {
                // This means the user cleared the video
                if (existingVehicle?.video?.id) {
                    await deleteOldFile(existingVehicle.video.id);
                }
                videoPayload = undefined; // Ensure it's removed from Firestore
            }
            setUploadProgress(null);


            const dataToSave = {
                ...carData,
                images: uploadedImages,
                ...(videoPayload && { video: videoPayload }),
            };

            if (!videoPayload) {
                // @ts-ignore
                dataToSave.video = null; // Explicitly set to null to delete
            }

            setSubmitStatusText('Finalizando...');

            if (isEditMode && existingVehicle) {
                const carDocRef = doc(firestore, 'cars', existingVehicle.id);
                await updateDocumentNonBlocking(carDocRef, dataToSave);
                toast({
                    title: dict.toast.update_success_title,
                    description: dict.toast.update_success_desc.replace('{make}', values.make).replace('{model}', values.model),
                });
            } else {
                const carsCollection = collection(firestore, 'cars');
                const newCar = {
                    ...dataToSave,
                    id: uuidv4(),
                };
                await addDocumentNonBlocking(carsCollection, newCar);
                toast({
                    title: dict.toast.add_success_title,
                    description: dict.toast.add_success_desc.replace('{make}', values.make).replace('{model}', values.model),
                });
            }

            router.push(`/${lang}/admin/vehicles`);
            router.refresh();

        } catch (error: any) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: isEditMode ? dict.toast.update_error_title : dict.toast.add_error_title,
                description: error.message || (isEditMode ? dict.toast.update_error_desc : dict.toast.add_error_desc),
            });
        } finally {
            setIsSubmitting(false);
            setUploadProgress(null);
        }
    }

    return {
        form,
        isSubmitting,
        submitStatusText,
        uploadProgress,
        isDecodingVin,
        isGeneratingDesc,
        isVinValid,
        handleDecodeVin,
        handleGenerateDescription,
        onSubmit,
        rawVinData,
        isRawDataDialogOpen,
        setIsRawDataDialogOpen,
    };
}

