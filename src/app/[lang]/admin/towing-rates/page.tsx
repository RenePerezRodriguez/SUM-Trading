import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TowingRatesClient from './_components/towing-rates-client';

export default async function AdminTowingRatesPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <div className="container py-6 sm:py-12">
            <PageHeader
                title="Tarifas de Arrastre"
                description="Gestiona las tarifas de arrastre desde aquí. Puedes subir un archivo Excel o editar precios manualmente."
            />
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/${lang}/admin`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al Panel
                        </Link>
                    </Button>
                </div>
                <TowingRatesClient lang={lang} />
            </div>
        </div>
    );
}
