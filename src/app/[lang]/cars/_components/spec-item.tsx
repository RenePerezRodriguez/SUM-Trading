
'use client';

type SpecItemProps = {
  icon: React.ElementType;
  value: string | number;
};

export default function SpecItem({ icon: Icon, value }: SpecItemProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="w-4 h-4" />
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
