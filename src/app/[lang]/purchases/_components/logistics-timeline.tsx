'use client';

import { CheckCircle2, Circle, Truck, Anchor, FileCheck, PackageCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type StepStatus = 'completed' | 'current' | 'pending';

interface TimelineStep {
  id: string;
  label: string;
  icon: React.ElementType;
  status: StepStatus;
  date?: string;
}

interface LogisticsTimelineProps {
  status: string; // 'paid', 'processing', 'transit', 'customs', 'delivered'
  className?: string;
}

export function LogisticsTimeline({ status, className }: LogisticsTimelineProps) {
  // Logic to determine step status based on current status
  // This is a simplified mapping for the demo
  const getStepStatus = (stepId: string, currentStatus: string): StepStatus => {
    const order = ['paid', 'processing', 'transit', 'customs', 'delivered'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const steps: TimelineStep[] = [
    { id: 'paid', label: 'Pagado', icon: CheckCircle2, status: getStepStatus('paid', status) },
    { id: 'processing', label: 'Procesando', icon: FileCheck, status: getStepStatus('processing', status) },
    { id: 'transit', label: 'En Tránsito', icon: Truck, status: getStepStatus('transit', status) },
    { id: 'customs', label: 'Aduana', icon: Anchor, status: getStepStatus('customs', status) },
    { id: 'delivered', label: 'Entregado', icon: PackageCheck, status: getStepStatus('delivered', status) },
  ];

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative flex items-center justify-between w-full">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-secondary -z-10" />
        <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary transition-all duration-500 -z-10"
            style={{ 
                width: `${(steps.findIndex(s => s.status === 'current') / (steps.length - 1)) * 100}%` 
            }} 
        />

        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
              step.status === 'completed' ? "bg-primary border-primary text-primary-foreground" :
              step.status === 'current' ? "bg-background border-primary text-primary animate-pulse" :
              "bg-secondary border-secondary text-muted-foreground"
            )}>
              <step.icon className="w-4 h-4" />
            </div>
            <span className={cn(
              "text-[10px] uppercase tracking-wider font-medium hidden md:block",
              step.status === 'pending' ? "text-muted-foreground" : "text-foreground"
            )}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
