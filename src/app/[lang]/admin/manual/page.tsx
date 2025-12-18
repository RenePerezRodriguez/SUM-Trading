"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import {
    manualSections,
    SectionNumber,
    StepItem,
    WarningBox,
    CriticalBox,
    ActionCard,
    StatusFlow,
    ExternalLinkCard,
    Plus,
    Pencil,
    RotateCcw,
    Trash2,
    Car,
    Users,
    MessageSquare,
    Truck,
    FileSpreadsheet,
    History,
    Search,
    BarChart3,
    HelpCircle,
    UserPlus,
} from "@/components/admin/manual-components";

export default function AdminManualPage() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body { 
                        -webkit-print-color-adjust: exact !important; 
                        print-color-adjust: exact !important;
                        background: white !important;
                    }
                    .no-print { display: none !important; }
                    .print-break { page-break-before: always; }
                    @page { margin: 1.5cm; size: A4; }
                }
            `}</style>

            <div className="min-h-screen bg-white">
                {/* Header - No aparece en impresión */}
                <header className="no-print sticky top-0 z-50 bg-white border-b shadow-sm">
                    <div className="container flex items-center justify-between h-16">
                        <Link
                            href="/es/admin"
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al Panel
                        </Link>
                        <Button onClick={handlePrint} size="sm" className="gap-2">
                            <Printer className="h-4 w-4" />
                            Imprimir / Guardar PDF
                        </Button>
                    </div>
                </header>

                {/* Contenido del Manual */}
                <div className="container py-12 max-w-4xl bg-white">
                    {/* Título */}
                    <div className="text-center mb-12 pb-8 border-b">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Manual de Administración
                        </h1>
                        <p className="text-xl text-gray-500">SUM Trading</p>
                        <p className="text-sm text-gray-400 mt-2">Guía Paso a Paso - Diciembre 2024</p>
                    </div>

                    {/* Índice */}
                    <nav className="bg-gray-50 border rounded-xl p-6 mb-12">
                        <h2 className="text-xl font-bold mb-4">Contenido</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {manualSections.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white font-semibold text-sm">
                                        {item.num}
                                    </span>
                                    <item.icon className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-gray-700">{item.title}</span>
                                </a>
                            ))}
                        </div>
                    </nav>

                    {/* Sección 1: Acceso */}
                    <section id="acceso" className="mb-12 pb-8 border-b">
                        <div className="flex items-center gap-3 mb-6">
                            <SectionNumber num={1} />
                            <h2 className="text-2xl font-bold text-gray-900">Cómo Entrar al Sistema</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-gray-600">Abre esta página en tu navegador:</p>
                                <code className="font-mono text-blue-700 font-semibold text-lg">sumtrading.us/admin/login</code>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-800">Haz esto:</h3>
                                <StepItem num={1}>Escribe tu <strong>correo electrónico</strong></StepItem>
                                <StepItem num={2}>Escribe tu <strong>contraseña</strong></StepItem>
                                <StepItem num={3}>Toca el botón <strong>"Iniciar Sesión"</strong></StepItem>
                            </div>

                            <WarningBox title="¿Olvidaste tu contraseña?">
                                Toca "Olvidé mi contraseña" y revisa tu correo.
                            </WarningBox>
                        </div>
                    </section>

                    {/* Sección 2: Dashboard */}
                    <section id="dashboard" className="mb-12 pb-8 border-b">
                        <div className="flex items-center gap-3 mb-6">
                            <SectionNumber num={2} />
                            <h2 className="text-2xl font-bold text-gray-900">Pantalla Principal</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Cuando entras, ves un resumen de todo. Hay tarjetas que puedes tocar:
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Car, title: "Vehículos", desc: "Cuántos autos tienes" },
                                { icon: Users, title: "Usuarios", desc: "Personas registradas" },
                                { icon: MessageSquare, title: "Leads", desc: "Clientes que preguntaron" },
                                { icon: Truck, title: "Tarifas", desc: "Precios de grúas" },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                                    <item.icon className="h-6 w-6 text-red-600 shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Sección 3: Vehículos */}
                    <section id="vehiculos" className="mb-12 pb-8 border-b print-break">
                        <div className="flex items-center gap-3 mb-6">
                            <SectionNumber num={3} />
                            <h2 className="text-2xl font-bold text-gray-900">Vehículos</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ActionCard icon={Plus} title="Agregar auto nuevo" color="green">
                                <ol className="space-y-1">
                                    <li>1. Toca "+ Agregar"</li>
                                    <li>2. Llena: marca, modelo, año, precio</li>
                                    <li>3. Sube las fotos</li>
                                    <li>4. Toca "Guardar"</li>
                                </ol>
                            </ActionCard>
                            <ActionCard icon={Pencil} title="Modificar un auto" color="blue">
                                <ol className="space-y-1">
                                    <li>1. Busca el auto en la lista</li>
                                    <li>2. Toca el ícono del lápiz</li>
                                    <li>3. Cambia lo que necesites</li>
                                    <li>4. Toca "Guardar"</li>
                                </ol>
                            </ActionCard>
                            <ActionCard icon={RotateCcw} title="Cambiar estado" color="orange">
                                <p>En la columna "Estado", toca para elegir:</p>
                                <p className="mt-1"><strong>Disponible / Reservado / Vendido</strong></p>
                            </ActionCard>
                            <ActionCard icon={Trash2} title="Borrar autos" color="red">
                                <ol className="space-y-1">
                                    <li>1. Marca las casillas de los autos</li>
                                    <li>2. Toca el botón rojo "Eliminar"</li>
                                </ol>
                            </ActionCard>
                        </div>
                    </section>

                    {/* Sección 4: Usuarios */}
                    <section id="usuarios" className="mb-12 pb-8 border-b">
                        <div className="flex items-center gap-3 mb-6">
                            <SectionNumber num={4} />
                            <h2 className="text-2xl font-bold text-gray-900">Usuarios</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ActionCard icon={UserPlus} title="Hacer a alguien Admin" color="blue">
                                <p>En la columna "Rol", toca para cambiar entre <strong>Usuario</strong> y <strong>Admin</strong></p>
                            </ActionCard>
                            <ActionCard icon={Trash2} title="Borrar usuario" color="red">
                                <p>Marca la casilla del usuario y toca "Eliminar"</p>
                            </ActionCard>
                        </div>
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-600"><strong>Nota:</strong> No puedes borrarte a ti mismo.</p>
                        </div>
                    </section>

                    {/* Sección 5: Leads */}
                    <section id="leads" className="mb-12 pb-8 border-b print-break">
                        <div className="flex items-center gap-3 mb-6">
                            <SectionNumber num={5} />
                            <h2 className="text-2xl font-bold text-gray-900">Leads (Solicitudes de Clientes)</h2>
                        </div>
                        <div className="space-y-6">
                            <CriticalBox title="REVISA ESTO TODOS LOS DÍAS">
                                Aquí llegan las personas que quieren comprar
                            </CriticalBox>

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-3">Hay 2 tipos de clientes:</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="font-semibold text-blue-700">Leads Copart</p>
                                        <p className="text-sm text-gray-600">Quieren autos de subastas</p>
                                    </div>
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="font-semibold text-green-700">Leads SUM</p>
                                        <p className="text-sm text-gray-600">Quieren autos de tu inventario</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-3">Cómo marcar el progreso:</h4>
                                <StatusFlow />
                                <p className="text-sm text-center text-gray-500 mt-3">
                                    Toca en la columna "Estado" para cambiar
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Sección 6: Tarifas */}
                    <section id="tarifas" className="mb-12 pb-8 border-b">
                        <div className="flex items-center gap-3 mb-6">
                            <SectionNumber num={6} />
                            <h2 className="text-2xl font-bold text-gray-900">Precios de Grúas (Tarifas)</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Estos son los precios que ven los clientes cuando usan la calculadora.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ActionCard icon={FileSpreadsheet} title="Subir Excel" color="green">
                                <ol className="space-y-1">
                                    <li>1. Toca "Subir Excel"</li>
                                    <li>2. Elige el archivo</li>
                                    <li>3. Revisa los cambios</li>
                                    <li>4. Confirma</li>
                                </ol>
                            </ActionCard>
                            <ActionCard icon={Plus} title="Agregar uno" color="blue">
                                <p>+ Destino (Miami)</p>
                                <p>+ Estado (California)</p>
                                <p>+ Ciudad ($450)</p>
                            </ActionCard>
                            <ActionCard icon={History} title="¿Te equivocaste?" color="orange">
                                <p>Toca "Historial" para volver a una versión anterior</p>
                            </ActionCard>
                        </div>
                    </section>

                    {/* Sección 7: Analíticas */}
                    <section id="analiticas" className="mb-12 pb-8 border-b">
                        <div className="flex items-center gap-3 mb-6">
                            <SectionNumber num={7} />
                            <h2 className="text-2xl font-bold text-gray-900">Ver Estadísticas</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Para ver cuántas personas visitan tu sitio:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ExternalLinkCard
                                href="https://clarity.microsoft.com/"
                                icon={Search}
                                title="Microsoft Clarity"
                                description="Ver dónde hacen clic los usuarios"
                                iconBg="bg-blue-100"
                            />
                            <ExternalLinkCard
                                href="https://analytics.google.com/"
                                icon={BarChart3}
                                title="Google Analytics"
                                description="Ver cuántos visitan y de dónde"
                                iconBg="bg-orange-100"
                            />
                        </div>
                    </section>

                    {/* Sección 8: Soporte */}
                    <section id="soporte" className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <SectionNumber num={8} />
                            <h2 className="text-2xl font-bold text-gray-900">Ayuda</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-5 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <HelpCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-blue-700">¿Perdido? Usa el Tour</p>
                                        <p className="text-sm text-gray-600">
                                            En cualquier página, toca el botón <strong>"Tour"</strong> arriba a la derecha.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 bg-gray-100 rounded-lg">
                                <p className="font-semibold text-gray-800 mb-1">¿Algo no funciona?</p>
                                <p className="text-sm text-gray-600">
                                    Contacta al equipo técnico de SUM Trading.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="text-center text-sm text-gray-400 pt-8 border-t">
                        <p>SUM Trading - Manual versión 1.0 - Diciembre 2024</p>
                    </footer>
                </div>
            </div>
        </>
    );
}
