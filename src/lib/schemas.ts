import { z } from 'zod';
import type { Car, CarImage } from './placeholder-data';
import type { UserProfile } from './user-profile';

export const carTypes = ['Sport', 'SUV', 'Sedan', 'Classic', 'Truck', 'Convertible', 'Other'] as const;
export const transmissionTypes = ['Automatic', 'Manual'] as const;
export const titleTypes = ['Clean Title', 'Salvage Title', 'Rebuilt Title', 'Parts Only', 'Other'] as const;
export const engineStatusTypes = ['Runs and Drives', 'Starts', 'Does Not Start'] as const;
export const primaryDamageTypes = ['None', 'Front End', 'Rear End', 'Side', 'All Over', 'Vandalism', 'Water/Flood', 'Hail', 'Mechanical', 'Other'] as const;
export const carStatusTypes = ['Available', 'Reserved', 'Sold'] as const;
export const fuelTypes = ['Gas', 'Diesel', 'Electric', 'Hybrid'] as const;

const imageSchema = z.object({
    id: z.string().optional(),
    url: z.string().url(),
    file: z.any().optional(), // For new uploads
});

const provenanceSchema = z.object({
    country: z.string().min(2, "Country is required."),
    city: z.string().min(2, "City is required."),
});

export const createVehicleSchema = (dict: any, isEditMode: boolean) => z.object({
    lotNumber: z.string().optional(),
    make: z.string().min(2, dict.validation.make_required),
    model: z.string().min(1, dict.validation.model_required),
    vin: z.string().length(17, dict.validation.vin_invalid),
    year: z.coerce.number().min(1900, dict.validation.year_invalid).max(new Date().getFullYear() + 1, dict.validation.year_invalid),
    price: z.coerce.number().min(0, dict.validation.price_positive),
    estimatedRetailValue: z.coerce.number().optional(),
    description: z.string().min(10, dict.validation.description_short),
    highlights: z.string().optional(),
    mileage: z.coerce.number().min(0, dict.validation.mileage_positive),
    mileageUnit: z.enum(['mi', 'km']),
    engine: z.string().min(2, dict.validation.engine_required),
    cylinders: z.coerce.number().optional(),
    horsepower: z.coerce.number().min(10, dict.validation.horsepower_low),
    transmission: z.enum(transmissionTypes, { errorMap: () => ({ message: dict.validation.transmission_required }) }),
    drive: z.string().optional(),
    fuel: z.enum(fuelTypes).optional(),
    color: z.string().min(2, dict.validation.color_required),
    type: z.enum(carTypes),
    otherType: z.string().optional(),
    status: z.enum(carStatusTypes).default('Available'),
    provenance: provenanceSchema,
    isFeatured: z.boolean().default(false),
    images: z.array(imageSchema).min(1, dict.validation.image_required),
    videoFile: z.any().optional(),
    titleCode: z.string().optional(),
    titleType: z.enum(titleTypes, { errorMap: () => ({ message: dict.validation.titleType_required }) }),
    otherTitleType: z.string().optional(),
    damageDescription: z.string().optional(),
    primaryDamage: z.enum(primaryDamageTypes),
    otherPrimaryDamage: z.string().optional(),
    secondaryDamage: z.enum(primaryDamageTypes).optional(),
    otherSecondaryDamage: z.string().optional(),
    engineStatus: z.enum(engineStatusTypes),
    hasKeys: z.boolean().default(false),
    internalNotes: z.string().optional(),
  }).superRefine((data, ctx) => {
      if (data.type === 'Other' && (!data.otherType || data.otherType.length < 2)) {
        ctx.addIssue({ code: 'custom', path: ['otherType'], message: dict.validation.other_required });
      }
      if (data.titleType === 'Other' && (!data.otherTitleType || data.otherTitleType.length < 2)) {
        ctx.addIssue({ code: 'custom', path: ['otherTitleType'], message: dict.validation.other_required });
      }
      if (data.primaryDamage === 'Other' && (!data.otherPrimaryDamage || data.otherPrimaryDamage.length < 2)) {
        ctx.addIssue({ code: 'custom', path: ['otherPrimaryDamage'], message: dict.validation.other_required });
      }
      if (data.secondaryDamage === 'Other' && (!data.otherSecondaryDamage || data.otherSecondaryDamage.length < 2)) {
        ctx.addIssue({ code: 'custom', path: ['otherSecondaryDamage'], message: dict.validation.other_required });
      }
    });

type Item = (Car & {type: 'car'}) | { type: 'service', name: string, description: string, price: number, url: string, image?: CarImage };

export type PurchaseRecord = {
    id: string;
    userId: string;
    purchaseDate: string;
    total: number;
    paymentId: string;
    purchaseType?: 'Car Purchase' | 'Copart Consultation';
    items?: Item[];
    cars?: Car[]; // Legacy, to be deprecated
};

export type SumLeadVehicle = {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    vin: string;
    imageUrl: string | null;
};

export type SumLead = {
    id: string;
    userId: string;
    submissionDate: string;
    status: 'active' | 'in-progress' | 'finished' | 'whatsapp-inquiry';
    vehicles: SumLeadVehicle[];
    user?: UserProfile;
};
