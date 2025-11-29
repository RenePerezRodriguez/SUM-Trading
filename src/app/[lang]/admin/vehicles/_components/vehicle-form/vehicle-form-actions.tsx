
'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

interface VehicleFormActionsProps {
  isSubmitting: boolean;
  submitStatusText: string;
  dict: any;
  isEditMode: boolean;
}

export default function VehicleFormActions({ isSubmitting, submitStatusText, dict, isEditMode }: VehicleFormActionsProps) {
  const { formState } = useFormContext();
  const buttonText = isEditMode ? dict.fields.update_button : dict.fields.save_button;

  return (
    <div className="flex justify-end pt-4">
      <Button type="submit" disabled={isSubmitting || !formState.isDirty}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting ? submitStatusText : buttonText}
      </Button>
    </div>
  );
}
