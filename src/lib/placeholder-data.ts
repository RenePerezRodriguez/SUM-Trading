import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => {
  const img = PlaceHolderImages.find((p) => p.id === id);
  if (!img) {
    return {
      id: 'fallback',
      url: 'https://placehold.co/600x400',
      hint: 'placeholder',
    };
  }
  return { id: img.id, url: img.imageUrl, hint: img.imageHint };
};

export type CarImage = {
  id: string;
  url: string;
  hint: string;
}

export type Car = {
  id: string;
  vin: string;
  lotNumber?: string;
  make: string;
  model: string;
  year: number;
  price: number;
  estimatedRetailValue?: number;
  description: string;
  highlights?: string;
  isFeatured: boolean;
  images: CarImage[];
  video?: {
    id: string;
    url: string;
  };
  mileage: number;
  mileageUnit: 'mi' | 'km';
  engine: string;
  cylinders?: number;
  horsepower: number;
  transmission: 'Automatic' | 'Manual';
  drive?: string;
  fuel?: 'Gas' | 'Diesel' | 'Electric' | 'Hybrid';
  color: string;
  type: 'Sport' | 'SUV' | 'Sedan' | 'Classic' | 'Truck' | 'Convertible' | 'Other';
  otherType?: string;
  status: 'Available' | 'Reserved' | 'Sold';
  provenance: {
    country: string;
    city: string;
  };
  titleCode?: string;
  titleType: 'Clean Title' | 'Salvage Title' | 'Rebuilt Title' | 'Parts Only' | 'Other';
  otherTitleType?: string;
  damageDescription?: string;
  primaryDamage: 'None' | 'Front End' | 'Rear End' | 'Side' | 'All Over' | 'Vandalism' | 'Water/Flood' | 'Hail' | 'Mechanical' | 'Other';
  otherPrimaryDamage?: string;
  secondaryDamage?: 'None' | 'Front End' | 'Rear End' | 'Side' | 'All Over' | 'Vandalism' | 'Water/Flood' | 'Hail' | 'Mechanical' | 'Other';
  engineStatus: 'Runs and Drives' | 'Starts' | 'Does Not Start';
  hasKeys: boolean;
};


export const cars: Car[] = [
  {
    id: '1',
    vin: '5YJSA1E2XLF531892',
    make: 'Tesla',
    model: 'Model S',
    year: 2022,
    price: 79990,
    description: 'A beautiful red Tesla Model S with autopilot and long range battery.',
    images: [findImage('car-1')],
    isFeatured: true,
    mileage: 15000,
    mileageUnit: 'mi',
    engine: 'Electric',
    horsepower: 670,
    transmission: 'Automatic',
    color: 'Red',
    type: 'Sedan',
    status: 'Available',
    provenance: { country: 'USA', city: 'Miami, FL' },
    titleType: 'Clean Title',
    engineStatus: 'Runs and Drives',
    primaryDamage: 'None',
    hasKeys: true,
  },
  {
    id: '2',
    vin: '1FMCU0E6XMU00000',
    make: 'Ford',
    model: 'Mustang Mach-E',
    year: 2023,
    price: 45995,
    description: 'A modern electric SUV with the soul of a Mustang.',
    images: [findImage('car-2')],
    isFeatured: true,
    mileage: 5000,
    mileageUnit: 'mi',
    engine: 'Electric',
    horsepower: 346,
    transmission: 'Automatic',
    color: 'Blue',
    type: 'SUV',
    status: 'Available',
    provenance: { country: 'USA', city: 'Los Angeles, CA' },
    titleType: 'Clean Title',
    engineStatus: 'Runs and Drives',
    primaryDamage: 'None',
    hasKeys: true,
  },
  {
    id: '3',
    vin: 'WAU2GAFCXN100000',
    make: 'Audi',
    model: 'A8',
    year: 2021,
    price: 86500,
    description: 'The pinnacle of luxury and technology in a full-size sedan.',
    images: [findImage('car-3')],
    isFeatured: false,
    mileage: 25000,
    mileageUnit: 'mi',
    engine: '3.0L V6 Turbo',
    horsepower: 335,
    transmission: 'Automatic',
    color: 'Black',
    type: 'Sedan',
    status: 'Available',
    provenance: { country: 'USA', city: 'New York, NY' },
    titleType: 'Clean Title',
    engineStatus: 'Runs and Drives',
    primaryDamage: 'None',
    hasKeys: true,
  },
  {
    id: '4',
    vin: '194677S100001',
    make: 'Chevrolet',
    model: 'Corvette',
    year: 1967,
    price: 120000,
    description: 'A classic white Corvette Stingray convertible in pristine condition.',
    images: [findImage('car-4')],
    isFeatured: true,
    mileage: 55000,
    mileageUnit: 'mi',
    engine: 'V8',
    horsepower: 350,
    transmission: 'Manual',
    color: 'White',
    type: 'Convertible',
    status: 'Reserved',
    provenance: { country: 'USA', city: 'Dallas, TX' },
    titleType: 'Rebuilt Title',
    engineStatus: 'Starts',
    primaryDamage: 'Side',
    hasKeys: true,
  },
  {
    id: '5',
    vin: 'JM1FD3733A000000',
    make: 'Mazda',
    model: 'RX-7',
    year: 1990,
    price: 25000,
    description: 'A well-maintained, iconic Japanese sports car with a rotary engine.',
    images: [findImage('car-5')],
    isFeatured: false,
    mileage: 85000,
    mileageUnit: 'mi',
    engine: '1.3L 13B-T rotary',
    horsepower: 200,
    transmission: 'Manual',
    color: 'Silver',
    type: 'Sport',
    status: 'Sold',
    provenance: { country: 'USA', city: 'Chicago, IL' },
    titleType: 'Clean Title',
    engineStatus: 'Runs and Drives',
    primaryDamage: 'None',
    hasKeys: true,
  },
  {
    id: '6',
    vin: '1FTFW1E5XKF00000',
    make: 'Ford',
    model: 'F-150',
    year: 2022,
    price: 55000,
    description: 'A rugged and reliable F-150 pickup truck, ready for work or play.',
    images: [findImage('car-6')],
    isFeatured: true,
    mileage: 12000,
    mileageUnit: 'mi',
    engine: '3.5L V6 EcoBoost',
    horsepower: 400,
    transmission: 'Automatic',
    color: 'Gray',
    type: 'Truck',
    status: 'Available',
    provenance: { country: 'USA', city: 'Houston, TX' },
    titleType: 'Clean Title',
    engineStatus: 'Runs and Drives',
    primaryDamage: 'None',
    hasKeys: true,
  },
  {
    id: '7',
    vin: 'WPOAB2A9XKS00000',
    make: 'Porsche',
    model: '911 GT3',
    year: 2023,
    price: 250000,
    description: 'The ultimate track weapon that is also street legal. A pure driving machine.',
    images: [findImage('car-7')],
    isFeatured: true,
    mileage: 2000,
    mileageUnit: 'mi',
    engine: '4.0L Flat-6',
    horsepower: 502,
    transmission: 'Automatic',
    color: 'Yellow',
    type: 'Sport',
    status: 'Available',
    provenance: { country: 'USA', city: 'Miami, FL' },
    titleType: 'Clean Title',
    engineStatus: 'Runs and Drives',
    primaryDamage: 'None',
    hasKeys: true,
  },
  {
    id: '8',
    vin: '2T3H11V5XNW00000',
    make: 'Rivian',
    model: 'R1S',
    year: 2023,
    price: 85000,
    description: 'Adventure-ready electric SUV with incredible off-road capability.',
    images: [findImage('car-8')],
    isFeatured: false,
    mileage: 8000,
    mileageUnit: 'mi',
    engine: 'Quad-Motor Electric',
    horsepower: 835,
    transmission: 'Automatic',
    color: 'Green',
    type: 'SUV',
    status: 'Available',
    provenance: { country: 'USA', city: 'Seattle, WA' },
    titleType: 'Clean Title',
    engineStatus: 'Runs and Drives',
    primaryDamage: 'None',
    hasKeys: true,
  },
];

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  title: string;
  comment: string;
  avatar: {
    id: string;
    url: string;
    hint: string;
  }
};

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Carlos G.',
    location: 'Monterrey, MX',
    title: '¡Un servicio impecable!',
    comment: 'Todo el proceso fue transparente y mucho más rápido de lo que esperaba. El equipo de SUM Trading encontró exactamente el coche que buscaba y se encargó de todo. ¡100% recomendado!',
    avatar: findImage('avatar-1'),
  },
  {
    id: '2',
    name: 'Laura V.',
    location: 'Bogotá, CO',
    title: 'Mi sueño americano, ahora en mi garaje.',
    comment: 'Siempre quise un muscle car clásico. Ellos no solo lo encontraron, sino que gestionaron la importación sin que yo tuviera que preocuparme por nada. La comunicación fue excelente.',
    avatar: findImage('avatar-2'),
  },
  {
    id: '3',
    name: 'Javier M.',
    location: 'Madrid, ES',
    title: 'Profesionalismo y confianza.',
    comment: 'Comprar un coche de subasta en otro continente da miedo, pero el equipo me dio la confianza que necesitaba. La inspección previa fue clave. El coche llegó en perfectas condiciones.',
    avatar: findImage('avatar-3'),
  },
];
