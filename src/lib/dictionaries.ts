import type { Locale } from './i18n-config';
import { i18n } from './i18n-config';

// Define a type for our dictionary loaders
type DictionaryLoader = () => Promise<any>;

// Create a record of loaders for each locale
const dictionaries: Record<Locale, DictionaryLoader> = {
  en: async () => {
    const common = await import('@/locales/en/common.json');
    const home = await import('@/locales/en/home.json');
    const admin = await import('@/locales/en/admin.json');
    const auth = await import('@/locales/en/auth.json');
    const faq = await import('@/locales/en/faq.json');
    const contact = await import('@/locales/en/contact.json');
    const catalog = await import('@/locales/en/catalog.json');
    const about = await import('@/locales/en/about.json');
    const services = await import('@/locales/en/services.json');
    const vehicleDetails = await import('@/locales/en/vehicle-details.json');
    const garage = await import('@/locales/en/garage.json');
    const purchases = await import('@/locales/en/purchases.json');
    const legal = await import('@/locales/en/legal.json');
    const checkout = await import('@/locales/en/checkout.json');

    // Merge all the imported JSON modules for English
    return {
      ...common.default,
      ...home.default,
      ...faq.default,
      ...contact.default,
      ...catalog.default,
      ...about.default,
      ...services.default,
      ...vehicleDetails.default,
      ...garage.default,
      ...purchases.default,
      ...legal.default,
      ...checkout.default,
      ...admin.default,
      ...auth.default
    };
  },
  es: async () => {
    const common = await import('@/locales/es/common.json');
    const home = await import('@/locales/es/home.json');
    const admin = await import('@/locales/es/admin.json');
    const auth = await import('@/locales/es/auth.json');
    const faq = await import('@/locales/es/faq.json');
    const contact = await import('@/locales/es/contact.json');
    const catalog = await import('@/locales/es/catalog.json');
    const about = await import('@/locales/es/about.json');
    const services = await import('@/locales/es/services.json');
    const vehicleDetails = await import('@/locales/es/vehicle-details.json');
    const garage = await import('@/locales/es/garage.json');
    const purchases = await import('@/locales/es/purchases.json');
    const legal = await import('@/locales/es/legal.json');
    const checkout = await import('@/locales/es/checkout.json');

    // Merge all the imported JSON modules for Spanish
    return {
      ...common.default,
      ...home.default,
      ...faq.default,
      ...contact.default,
      ...catalog.default,
      ...about.default,
      ...services.default,
      ...vehicleDetails.default,
      ...garage.default,
      ...purchases.default,
      ...legal.default,
      ...checkout.default,
      ...admin.default,
      ...auth.default
    };
  },
};

// This function returns the fully merged dictionary for the given locale.
export const getDictionary = async (locale: Locale): Promise<any> => {
  const loader = dictionaries[locale] || dictionaries[i18n.defaultLocale];
  return loader();
};
