'use client';

type SpecItemProps = {
  icon: React.ElementType;
  value: string | number;
  label: string;
};

export default function SpecItem({ icon: Icon, value, label }: SpecItemProps) {
  return (
    <div className="flex items-center gap-3 text-sm" title={label}>
        <Icon className="w-5 h-5 text-primary/80 flex-shrink-0" />
        <div>
            <p className="font-semibold text-foreground leading-tight">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    </div>
  );
}
