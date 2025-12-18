"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export function AdminTour() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const drive = () => {
        const driverObj = driver({
            showProgress: true,
            animate: true,
            steps: [
                {
                    element: "#admin-sidebar",
                    popover: {
                        title: "Menú Principal",
                        description: "Desde aquí puedes navegar a todas las secciones administrativas.",
                        side: "right",
                        align: "start",
                    },
                },
                {
                    element: "#nav-manage-towing-rates",
                    popover: {
                        title: "Tarifas de Grúas",
                        description: "Gestiona los precios, sube Excel masivos o edita tarifas individuales.",
                        side: "right",
                    },
                },
                {
                    element: "#nav-manage-users",
                    popover: {
                        title: "Usuarios y Miembros",
                        description: "Administra los usuarios registrados y el directorio de miembros (Directiva, Equipo).",
                        side: "right",
                    },
                },
                {
                    element: "#nav-manage-leads",
                    popover: {
                        title: "Leeds de Copart",
                        description: "Administra las solicitudes de importacion.",
                        side: "right",
                    },
                },
                {
                    element: "#admin-user-menu",
                    popover: {
                        title: "Tu Perfil",
                        description: "Cierra sesión o ajusta tus preferencias aquí.",
                        side: "bottom",
                        align: "end",
                    },
                },
            ],
        });

        driverObj.drive();
    };

    if (!mounted) return null;

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={drive}
            className="gap-2 ml-auto bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 border-yellow-200 dark:border-yellow-800"
        >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden md:inline">Ayuda / Tour</span>
        </Button>
    );
}
