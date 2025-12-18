"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { Button } from "@/components/ui/button";
import { HelpCircle, BookOpen } from "lucide-react";

// Tour steps for each section
const dashboardSteps: DriveStep[] = [
    {
        popover: {
            title: "👋 Bienvenido al Panel de Control",
            description: "Este es el centro de operaciones de SUM Trading. Desde aquí gestionas todo: vehículos, clientes potenciales, precios de grúas y más.",
        },
    },
    {
        element: "#nav-manage-vehicles",
        popover: {
            title: "🚗 Gestión de Vehículos",
            description: "Aquí administras el catálogo de autos. Puedes agregar, editar, eliminar y cambiar estados.",
            side: "bottom",
        },
    },
    {
        element: "#nav-manage-users",
        popover: {
            title: "👥 Gestión de Usuarios",
            description: "Ve los usuarios registrados. Cambia roles o elimina cuentas.",
            side: "bottom",
        },
    },
    {
        element: "#nav-manage-leads",
        popover: {
            title: "📈 Leads de Clientes",
            description: "¡Importante! Aquí llegan las solicitudes de cotización. Hay dos tipos: Copart y SUM.",
            side: "bottom",
        },
    },
    {
        element: "#nav-view-analytics",
        popover: {
            title: "📊 Analíticas",
            description: "Estadísticas de visitas. Te lleva a Microsoft Clarity.",
            side: "bottom",
        },
    },
    {
        element: "#nav-manage-towing-rates",
        popover: {
            title: "🚚 Tarifas de Arrastre",
            description: "Gestiona precios de grúas. Sube Excel o edita manualmente.",
            side: "bottom",
        },
    },
];

const vehiclesSteps: DriveStep[] = [
    {
        popover: {
            title: "🚗 Gestión de Vehículos",
            description: "En esta sección administras todo el catálogo de autos de SUM Trading.",
        },
    },
    {
        element: "a[href*='/admin/vehicles/new']",
        popover: {
            title: "➕ Agregar Vehículo",
            description: "Haz clic aquí para crear un nuevo vehículo con fotos, precio y descripción.",
            side: "bottom",
        },
    },
    {
        element: "input[placeholder*='Filter']",
        popover: {
            title: "🔍 Buscar por Marca",
            description: "Escribe aquí para filtrar vehículos por marca (ej: Toyota, Honda).",
            side: "bottom",
        },
    },
    {
        element: "table",
        popover: {
            title: "📋 Lista de Vehículos",
            description: "Aquí ves todos los autos. Usa las columnas para ordenar. El lápiz edita, la basura elimina.",
            side: "top",
        },
    },
];

const usersSteps: DriveStep[] = [
    {
        popover: {
            title: "👥 Gestión de Usuarios",
            description: "Aquí ves todas las personas registradas en la plataforma.",
        },
    },
    {
        element: "input[placeholder*='Filter']",
        popover: {
            title: "🔍 Buscar por Email",
            description: "Filtra usuarios escribiendo su correo electrónico.",
            side: "bottom",
        },
    },
    {
        element: "table",
        popover: {
            title: "📋 Lista de Usuarios",
            description: "Columna 'Rol': Haz clic para cambiar entre Usuario y Admin. Usa las casillas para seleccionar y eliminar varios.",
            side: "top",
        },
    },
];

const leadsSteps: DriveStep[] = [
    {
        popover: {
            title: "📈 Leads de Clientes",
            description: "¡Sección crítica! Aquí caen las solicitudes de cotización.",
        },
    },
    {
        element: "[role='tablist']",
        popover: {
            title: "📂 Pestañas Principales",
            description: "'Leads Copart' = consultas de subastas. 'Leads SUM' = consultas de autos de inventario.",
            side: "bottom",
        },
    },
    {
        element: "table",
        popover: {
            title: "📋 Tabla de Leads",
            description: "Cambia el estado de cada lead: Activo → En Progreso → Finalizado. ¡Revisa esto todos los días!",
            side: "top",
        },
    },
];

const towingSteps: DriveStep[] = [
    {
        popover: {
            title: "🚚 Tarifas de Arrastre",
            description: "Aquí controlas los precios de grúas que muestra la calculadora a los clientes.",
        },
    },
    {
        element: "[role='tablist']",
        popover: {
            title: "🗂️ Pestañas de Destinos",
            description: "Cada pestaña es un destino (Miami, Houston...). Selecciona uno para ver sus precios.",
            side: "bottom",
        },
    },
    {
        element: "table",
        popover: {
            title: "📋 Tabla de Precios",
            description: "Aquí ves Estados → Ciudades → Precios. Usa el lápiz para editar y la basura para eliminar.",
            side: "top",
        },
    },
    {
        popover: {
            title: "💡 Acciones Importantes",
            description: "Busca los botones arriba: 'Subir Excel' para carga masiva y 'Historial' para restaurar versiones anteriores.",
        },
    },
];

export function AdminTour() {
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    // Determine which tour to show based on current route
    const getTourSteps = useCallback((): DriveStep[] => {
        if (pathname.includes('/admin/vehicles')) return vehiclesSteps;
        if (pathname.includes('/admin/users')) return usersSteps;
        if (pathname.includes('/admin/copart-leads')) return leadsSteps;
        if (pathname.includes('/admin/towing-rates')) return towingSteps;
        // Default: dashboard tour
        return dashboardSteps;
    }, [pathname]);

    const getTourKey = useCallback((): string => {
        if (pathname.includes('/admin/vehicles')) return 'sumtrading_tour_vehicles_v1';
        if (pathname.includes('/admin/users')) return 'sumtrading_tour_users_v1';
        if (pathname.includes('/admin/copart-leads')) return 'sumtrading_tour_leads_v1';
        if (pathname.includes('/admin/towing-rates')) return 'sumtrading_tour_towing_v1';
        return 'sumtrading_tour_dashboard_v1';
    }, [pathname]);

    useEffect(() => {
        setMounted(true);

        // Auto-start tour only on first visit to each section
        const tourKey = getTourKey();
        const hasSeenTour = localStorage.getItem(tourKey);
        if (!hasSeenTour) {
            setTimeout(() => {
                startTour(true);
            }, 1500);
        }
    }, [getTourKey]);

    const startTour = (isAutoStart = false) => {
        const steps = getTourSteps();
        const tourKey = getTourKey();

        const driverObj = driver({
            showProgress: true,
            animate: true,
            doneBtnText: '¡Entendido!',
            nextBtnText: 'Siguiente',
            prevBtnText: 'Anterior',
            progressText: 'Paso {{current}} de {{total}}',
            popoverClass: 'sumtrading-tour',
            steps: steps,
            onDestroyed: () => {
                if (isAutoStart) {
                    localStorage.setItem(tourKey, 'true');
                }
            }
        });

        driverObj.drive();
    };

    if (!mounted) return null;

    return (
        <>
            <style jsx global>{`
        /* SUM Trading Tour Theme - Using project brand colors */
        .sumtrading-tour .driver-popover {
          background: #ffffff;
          border: 2px solid hsl(1, 83%, 53%); /* Primary Red */
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(237, 35, 29, 0.15);
        }
        .sumtrading-tour .driver-popover-title {
          font-family: 'Inter', system-ui, sans-serif;
          color: hsl(1, 83%, 53%); /* Primary Red */
          font-size: 1.1rem;
          font-weight: 600;
        }
        .sumtrading-tour .driver-popover-description {
          color: hsl(218, 17%, 24%); /* Foreground */
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .sumtrading-tour .driver-popover-progress-text {
          color: hsl(215, 16%, 45%); /* Muted foreground */
        }
        .sumtrading-tour .driver-popover-footer button {
          background: hsl(1, 83%, 53%); /* Primary Red */
          color: white;
          text-shadow: none;
          border-radius: 4px;
          border: none;
          padding: 8px 16px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .sumtrading-tour .driver-popover-footer button:hover {
          background: hsl(1, 83%, 45%); /* Darker Red */
        }
        .sumtrading-tour .driver-popover-footer .driver-popover-prev-btn {
          background: transparent;
          color: hsl(218, 17%, 24%);
          border: 1px solid hsl(214, 32%, 91%);
        }
        .sumtrading-tour .driver-popover-footer .driver-popover-prev-btn:hover {
          background: hsl(214, 32%, 91%);
        }
        /* Highlight border color */
        .driver-active-element {
          outline: 2px solid hsl(1, 83%, 53%) !important;
          outline-offset: 2px;
        }
      `}</style>
            <div className="flex gap-2 ml-auto">
                <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-2 border-accent/50 text-accent hover:bg-accent/10 hover:text-accent transition-all"
                >
                    <Link href="/es/admin/manual">
                        <BookOpen className="h-4 w-4" />
                        <span className="hidden md:inline">Manual</span>
                    </Link>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startTour(false)}
                    className="gap-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary transition-all"
                >
                    <HelpCircle className="h-4 w-4" />
                    <span className="hidden md:inline">Tour</span>
                </Button>
            </div>
        </>
    );
}
