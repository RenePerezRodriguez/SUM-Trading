
export interface NormalizedVehicle {
    source: 'Copart' | 'IAAI' | 'SUM';
    title: string;
    lot_number: string | null;
    year: number | null;
    make: string | null;
    model: string | null;
    current_bid: number | null;
    buy_it_now_price?: number | null;
    sale_date?: string | null;
    odometer: string | null;
    engine_type?: string | null;
    primary_damage?: string | null;
    secondary_damage?: string | null;
    estimated_retail_value?: number | null;
    vin: string | null;
    imageUrl: string | null;
    location: string | null;
    url: string;
    doc_type?: string | null;
    condition?: string | null;
    keys?: string | null;
    highlights?: string[] | null;
    images_full?: string[] | null;
    engine_video?: string | null;
    [key: string]: any; // Allow other properties
}

const getPrice = (priceString: string | number | undefined | null): number | null => {
    if (typeof priceString === 'number') return priceString;
    if (typeof priceString !== 'string' || priceString === "N/A") return null;
    const price = Number(priceString.replace(/[^0-9.-]+/g, ""));
    return isNaN(price) ? null : price;
}

const cleanString = (value: string | undefined | null): string | null => {
    if (typeof value === 'string' && value.toUpperCase() !== 'N/A' && value.trim() !== '') {
        return value;
    }
    return null;
}

// Updated Normalizer for the ScraptPress API structure
export const normalizeScraptpressData = (item: any): NormalizedVehicle => {
    const saleDate = item.auction_date ? new Date(item.auction_date).toLocaleDateString() : null;
    const year = item.year ? parseInt(item.year, 10) : null;
    const make = cleanString(item.make);
    const model = cleanString(item.model);

    return {
        source: 'Copart',
        title: `${year || ''} ${make || ''} ${model || ''}`.trim(),
        lot_number: item.lot_number || null,
        year,
        make,
        model,
        vin: cleanString(item.vin),
        current_bid: getPrice(item.current_bid),
        buy_it_now_price: getPrice(item.buy_it_now_price),
        sale_date: saleDate,
        odometer: cleanString(item.odometer),
        engine_type: cleanString(item.engine),
        primary_damage: cleanString(item.primary_damage),
        secondary_damage: cleanString(item.secondary_damage),
        estimated_retail_value: getPrice(item.estimated_retail_value),
        imageUrl: item.imageUrl && item.imageUrl !== "N/A" ? item.imageUrl : `https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/${item.lot_number}.JPG`,
        location: cleanString(item.location),
        url: item.copart_url || '#',
        doc_type: cleanString(item.doc_type),
        condition: cleanString(item.sale_status),
        keys: cleanString(item.has_keys),
        highlights: item.highlights || [],
        images_full: item.images_gallery?.map((img: any) => img.high_res || img.full || img.thumbnail) || [],
        engine_video: cleanString(item.engine_video),
        transmission: cleanString(item.transmission),
        drive: cleanString(item.drive),
        fuel: cleanString(item.fuel),
        color: cleanString(item.exterior_color),
        cylinders: cleanString(item.cylinders),
    };
};
