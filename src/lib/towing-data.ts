import towingRatesData from '../../docs/arrastre/towing-rates.json';

export interface CityRate {
    name: string;
    price: number;
}

export interface StateData {
    name: string;
    cities: CityRate[];
}

export interface DestinationData {
    [stateKey: string]: StateData;
}

export interface TowingRates {
    destinations: {
        [destinationKey: string]: DestinationData;
    };
}

const data = towingRatesData as TowingRates;

export const getDestinations = () => {
    return Object.keys(data.destinations).map(key => ({
        id: key,
        label: key.charAt(0).toUpperCase() + key.slice(1) // Capitalize
    }));
};

export const getStatesByDestination = (destinationId: string) => {
    const destination = data.destinations[destinationId];
    if (!destination) return [];

    return Object.keys(destination).map(key => ({
        id: key,
        name: destination[key].name
    })).sort((a, b) => a.name.localeCompare(b.name));
};

export const getCitiesByState = (destinationId: string, stateId: string) => {
    const destination = data.destinations[destinationId];
    if (!destination) return [];

    const state = destination[stateId];
    if (!state) return [];

    return state.cities.sort((a, b) => a.name.localeCompare(b.name));
};

export const getRate = (destinationId: string, stateId: string, cityName: string) => {
    const cities = getCitiesByState(destinationId, stateId);
    return cities.find(c => c.name === cityName)?.price || 0;
};
