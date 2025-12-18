import {
    LogIn,
    LayoutDashboard,
    Car,
    Users,
    UserPlus,
    MessageSquare,
    Truck,
    BarChart3,
    HelpCircle,
    Plus,
    Pencil,
    RotateCcw,
    Trash2,
    FileSpreadsheet,
    History,
    Search,
    CheckCircle,
    Clock,
    AlertTriangle,
    ExternalLink,
    ArrowRight
} from "lucide-react";
import { LucideIcon } from "lucide-react";

// Types
interface ManualSection {
    id: string;
    num: number;
    title: string;
    icon: LucideIcon;
}

// Data
export const manualSections: ManualSection[] = [
    { num: 1, title: "Cómo Entrar", id: "acceso", icon: LogIn },
    { num: 2, title: "Pantalla Principal", id: "dashboard", icon: LayoutDashboard },
    { num: 3, title: "Vehículos", id: "vehiculos", icon: Car },
    { num: 4, title: "Usuarios", id: "usuarios", icon: Users },
    { num: 5, title: "Leads (Clientes)", id: "leads", icon: MessageSquare },
    { num: 6, title: "Precios de Grúas", id: "tarifas", icon: Truck },
    { num: 7, title: "Ver Estadísticas", id: "analiticas", icon: BarChart3 },
    { num: 8, title: "Ayuda", id: "soporte", icon: HelpCircle },
];

// Components
export function SectionNumber({ num }: { num: number }) {
    return (
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold shrink-0">
            {num}
        </span>
    );
}

export function StepItem({ num, children }: { num: number; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-semibold shrink-0">
                {num}
            </span>
            <span>{children}</span>
        </div>
    );
}

export function WarningBox({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
            <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                    <p className="font-semibold text-yellow-700">{title}</p>
                    <p className="text-sm text-gray-600">{children}</p>
                </div>
            </div>
        </div>
    );
}

export function CriticalBox({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
            <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" />
                <div>
                    <p className="font-bold text-red-700 text-lg">{title}</p>
                    <p className="text-sm text-gray-600">{children}</p>
                </div>
            </div>
        </div>
    );
}

export function ActionCard({
    icon: Icon,
    title,
    children,
    color = "blue"
}: {
    icon: LucideIcon;
    title: string;
    children: React.ReactNode;
    color?: "green" | "blue" | "orange" | "red";
}) {
    const colors = {
        green: "text-green-600",
        blue: "text-blue-600",
        orange: "text-orange-600",
        red: "text-red-600",
    };
    return (
        <div className="p-5 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
                <Icon className={`h-5 w-5 ${colors[color]}`} />
                <h4 className="font-semibold">{title}</h4>
            </div>
            <div className="text-sm text-gray-600 ml-7">{children}</div>
        </div>
    );
}

export function StatusFlow() {
    return (
        <div className="flex items-center justify-center gap-3 p-4 bg-gray-100 rounded-lg flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
                <Clock className="h-4 w-4 text-blue-700" />
                <span className="text-sm font-medium text-blue-700">Activo</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full">
                <RotateCcw className="h-4 w-4 text-yellow-700" />
                <span className="text-sm font-medium text-yellow-700">En Progreso</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-700" />
                <span className="text-sm font-medium text-green-700">Finalizado</span>
            </div>
        </div>
    );
}

export function ExternalLinkCard({
    href,
    icon: Icon,
    title,
    description,
    iconBg = "bg-blue-100"
}: {
    href: string;
    icon: LucideIcon;
    title: string;
    description: string;
    iconBg?: string;
}) {
    return (
        <a
            href={href}
            target="_blank"
            className="flex items-center gap-4 p-5 border border-gray-200 rounded-xl hover:border-blue-400 transition-colors group"
        >
            <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
                <h4 className="font-semibold group-hover:text-blue-600 transition-colors">{title}</h4>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
        </a>
    );
}

// Re-export icons for use in page
export {
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
    ExternalLink
};
