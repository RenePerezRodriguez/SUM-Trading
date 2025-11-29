import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import VehicleForm from '../_components/vehicle-form';

export default async function AdminAddVehiclePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = dict.add_vehicle_page;
  
  return (
    <div className="container py-12">
      <PageHeader 
        title={content.title}
        description={content.description}
      />
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
            <Button asChild variant="outline">
              <Link href={`/${lang}/admin/vehicles`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {content.back_button}
              </Link>
            </Button>
        </div>
        <Card className="p-4 sm:p-6">
            <VehicleForm lang={lang} dict={dict} />
        </Card>
      </div>
    </div>
  );
}
