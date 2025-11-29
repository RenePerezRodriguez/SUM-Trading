import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, FileCheck, Car } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ServicesCards({ dict, lang }: { dict: any; lang: string }) {
    const services = dict.services_page;

    const servicesList = [
        {
            icon: Truck,
            title: services.towing_title,
            description: services.towing_desc,
            href: `/${lang}/services#tarifas-arrastre`,
        },
        {
            icon: FileCheck,
            title: services.auction_title,
            description: services.auction_desc,
            href: `/${lang}/search`,
        },
        {
            icon: Car,
            title: services.sum_cars_title,
            description: services.sum_cars_desc,
            href: `/${lang}#inventario-sum-trading`,
        },
    ];

    return (
        <section className="relative">
            <div className="container">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-headline mb-3 md:mb-4">
                        {services.title}
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                        {services.description}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto mb-8">
                    {servicesList.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <Link key={index} href={service.href} className="block">
                                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 shadow-sm h-full cursor-pointer hover:border-primary/50">
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-lg bg-primary/10">
                                                <Icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <CardTitle>{service.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">
                                            {service.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                <div className="text-center">
                    <Button asChild size="lg" className="shadow-lg">
                        <Link href={`/${lang}/services`}>
                            Ver Todos los Servicios
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
