import type { PurchaseRecord } from "./schemas";

export type UserProfile = {
    id: string;
    email: string;
    names: string;
    firstLastName: string;
    secondLastName?: string;
    registrationDate: string;
    role: 'admin' | 'user';
    favoriteCarIds: string[];
    phoneNumber: string;
    country: string; // Should be a two-letter ISO country code
    copartConsultation?: {
        paymentId: string;
        activationDate: string;
        status: 'active' | 'in-progress' | 'finished';
        purchase?: PurchaseRecord; // Added to hold related purchase data
    }
};
