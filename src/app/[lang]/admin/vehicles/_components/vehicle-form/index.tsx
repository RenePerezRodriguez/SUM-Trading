
'use client';

import { FormProvider } from 'react-hook-form';
import useVehicleForm from '@/hooks/use-vehicle-form';
import VehicleImageUpload from './vehicle-image-upload';
import VehicleVideoUpload from './vehicle-video-upload';
import VehicleFormFields from './vehicle-form-fields';
import VehicleFormActions from './vehicle-form-actions';
import type { Car } from '@/lib/placeholder-data';
import { carTypes, transmissionTypes, titleTypes, engineStatusTypes, primaryDamageTypes } from '@/lib/schemas';

export default function VehicleForm({ lang, dict, existingVehicle }: { lang: string, dict: any, existingVehicle?: Car }) {
  
  const {
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
  } = useVehicleForm({ existingVehicle, lang, dict });

  const handleFormSubmit = form.handleSubmit(onSubmit as any);

  // Extract the add_vehicle_page section for child components
  const formDict = dict.add_vehicle_page || dict;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            <VehicleImageUpload 
                dict={formDict} 
                uploadProgress={uploadProgress?.type === 'image' && uploadProgress.progress > 0 && uploadProgress.progress < 100 ? uploadProgress.progress : null}
            />
             <VehicleVideoUpload
                dict={formDict}
                uploadProgress={uploadProgress?.type === 'video' && uploadProgress.progress > 0 && uploadProgress.progress < 100 ? uploadProgress.progress : null}
                existingVideoUrl={existingVehicle?.video?.url}
            />
        </div>
        <VehicleFormFields 
            dict={formDict}
            transmissionTypes={transmissionTypes}
            carTypes={carTypes}
            titleTypes={titleTypes}
            engineStatusTypes={engineStatusTypes}
            primaryDamageTypes={primaryDamageTypes}
            isVinValid={isVinValid}
            isDecodingVin={isDecodingVin}
            handleDecodeVin={handleDecodeVin}
            isGeneratingDesc={isGeneratingDesc}
            handleGenerateDescription={handleGenerateDescription}
            rawVinData={rawVinData}
            isRawDataDialogOpen={isRawDataDialogOpen}
            setIsRawDataDialogOpen={setIsRawDataDialogOpen}
        />
        <VehicleFormActions 
            isSubmitting={isSubmitting}
            submitStatusText={submitStatusText}
            dict={formDict}
            isEditMode={!!existingVehicle}
        />
      </form>
    </FormProvider>
  );
}
