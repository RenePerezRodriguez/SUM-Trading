'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Car, Users, BarChart2, MessageSquare, ArrowRight, Shield, Package, UserCheck, Inbox, Truck } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n-config';
import { getDashboardStats } from './actions';
import { useToast } from '@/hooks/use-toast';

const adminActions = [
    {
        icon: Car,
        title: "Gestionar Vehículos",
        description: "Añadir, editar o eliminar vehículos del catálogo.",
        cta: "Ir a Vehículos",
        key: "manage_vehicles",
        href: '/admin/vehicles',
        disabled: false,
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    },
    {
        icon: Users,
        title: "Gestionar Usuarios",
        description: "Ver la lista de usuarios registrados y gestionar sus roles.",
        cta: "Ir a Usuarios",
        key: "manage_users",
        href: '/admin/users',
        disabled: false,
        color: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    },
    {
        icon: MessageSquare,
        title: "Leads de Clientes",
        description: "Gestionar clientes interesados en vehículos de Copart y de SUM Trading.",
        cta: "Ir a Leads",
        key: "manage_leads",
        href: '/admin/copart-leads',
        disabled: false,
        color: 'bg-green-500/10 text-green-500 border-green-500/20'
    },
    {
        icon: BarChart2,
        title: "Analíticas del Sitio",
        description: "Visualizar estadísticas de visitas, ventas y búsquedas populares.",
        cta: "Ver Analíticas",
        key: "view_analytics",
        href: '/admin/analytics',
        disabled: false,
        color: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    },
    {
        icon: Truck,
        title: "Tarifas de Arrastre",
        description: "Gestionar tarifas de arrastre. Subir Excel o editar precios manualmente.",
        cta: "Ir a Tarifas",
        key: "manage_towing_rates",
        href: '/admin/towing-rates',
        disabled: false,
        color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
    }
];

interface DashboardStats {
    totalVehicles: number;
    totalUsers: number;
    activeLeads: number;
}

export default function AdminDashboardClient({ dict, lang }: { dict: any, lang: Locale }) {
    const { user } = useUser();
    const { toast } = useToast();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const content = dict.admin_page;

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;

            try {
                const idToken = await user.getIdToken();
                const result = await getDashboardStats(idToken);

                if (result.success && result.data) {
                    setStats(result.data);
                } else {
                    console.error('Error fetching stats:', result.error);
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: result.error || 'No se pudieron cargar las estadísticas.'
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, toast]);

    const quickStats = [
        {
            icon: Package,
            label: 'Total Vehículos',
            value: loading ? '...' : stats?.totalVehicles.toString() || '0',
            color: 'text-blue-500'
        },
        {
            icon: UserCheck,
            label: 'Total Usuarios',
            value: loading ? '...' : stats?.totalUsers.toString() || '0',
            color: 'text-purple-500'
        },
        {
            icon: Inbox,
            label: 'Leads Activos',
            value: loading ? '...' : stats?.activeLeads.toString() || '0',
            color: 'text-green-500'
        }
    ];

    return (
        <div className="container py-12">
            {/* Enhanced Header */}
            <div className="text-center mb-12 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary mb-6">
                    <Shield className="h-4 w-4" />
                    <span>Panel de Control</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter font-headline mb-4">
                    {content.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {content.description}
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
                {quickStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="border-2 bg-gradient-to-br from-primary/5 to-transparent">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center ${stat.color}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        {loading ? (
                                            <Skeleton className="h-7 w-16 mt-1" />
                                        ) : (
                                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {adminActions.map((action) => {
                    const actionContent = content.actions[action.key as keyof typeof content.actions] || {
                        title: action.title,
                        description: action.description,
                        cta: action.cta
                    };
                    const Icon = action.icon;
                    return (
                        <Card key={action.key} className="flex flex-col border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group bg-background">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{actionContent.title}</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col flex-grow pt-0">
                                <CardDescription className="flex-grow text-sm leading-relaxed mb-6">{actionContent.description}</CardDescription>
                                <Button asChild className="w-full group-hover:scale-105 transition-transform" disabled={action.disabled}>
                                    <Link href={`/${lang}${action.href}`}>
                                        {actionContent.cta}
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
