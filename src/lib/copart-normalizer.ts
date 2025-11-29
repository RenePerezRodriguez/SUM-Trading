export interface CopartVehicle {
    source: 'Copart';
    title: string;
    lot_number: string | null;
    year: number | null;
    make: string | null;
    model: string | null;
    current_bid: number | null;
    buy_it_now_price: number | null;
    sale_date: string | null;
    odometer: string | null;
    engine_type: string | null;
    primary_damage: string | null;
    secondary_damage: string | null;
    estimated_retail_value: number | null;
    vin: string | null;
    imageUrl: string | null;
    location: string | null;
    url: string;
    doc_type: string | null;
    condition: string | null;
    keys: string | null;
    highlights: string[] | null;
    images_full: string[] | null;
    engine_video: string | null;
    [key: string]: any; // Allow other properties
}

export const normalizeCopartData = (item: any): CopartVehicle => {
    const getPrice = (priceString: string | number | undefined | null): number | null => {
        if (typeof priceString === 'number') return priceString;
        if (typeof priceString !== 'string') return null;
        const price = Number(priceString.replace(/[^0-9.-]+/g, ""));
        return isNaN(price) ? null : price;
    }

    const auctionDate = item.auction_date ? new Date(item.auction_date).toLocaleDateString() : null;

    return {
        ...item, // Keep all original fields
        source: 'Copart',
        title: item.title || `${item.year || ''} ${item.make || ''} ${item.model || ''}`.trim(),
        lot_number: item.lot_number || null,
        year: item.year || null,
        make: item.make || null,
        model: item.model || null,
        current_bid: getPrice(item.current_bid),
        buy_it_now_price: getPrice(item.buy_it_now_price),
        sale_date: auctionDate,
        odometer: item.odometer || null,
        engine_type: item.engine || item.engine_type || null,
        primary_damage: item.primary_damage || null,
        secondary_damage: item.secondary_damage || null,
        estimated_retail_value: getPrice(item.estimated_retail_value),
        vin: item.vin || null,
        imageUrl: item.imageUrl || (item.images && item.images.length > 0 ? item.images[0] : null),
        location: item.sale_location || item.location || 'N/A',
        url: item.item_url || '#',
        doc_type: item.doc_type || null,
        condition: item.condition || null,
        keys: item.keys || null,
        highlights: Array.isArray(item.highlights) ? item.highlights : (item.highlights ? [item.highlights] : null),
        images_full: item.images_full || item.images || [],
        engine_video: item.engine_video_high_res && item.engine_video_high_res.length > 0 ? item.engine_video_high_res[0] : null,
    };
};
