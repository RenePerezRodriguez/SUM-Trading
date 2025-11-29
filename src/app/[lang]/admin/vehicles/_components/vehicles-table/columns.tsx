
'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Car } from '@/lib/placeholder-data';
import { DataTableColumnHeader } from '@/app/admin/components/data-table-column-header';
import { VehiclesTableRowActions } from './vehicles-table-row-actions';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { carStatusTypes } from '@/lib/schemas';

interface ColumnsProps {
  dict: any;
  onDelete: (car: Car) => void;
  onStatusChange: (car: Car, status: 'Available' | 'Reserved' | 'Sold') => void;
}

export const columns = ({ dict, onDelete, onStatusChange }: ColumnsProps): ColumnDef<Car>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'make',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vehículo" />
    ),
    cell: ({ row }) => {
        const car = row.original;
        const mainImage = car.images && car.images.length > 0 ? car.images[0] : null;
        return (
            <div className="flex items-center gap-3">
                <div className="relative h-10 w-16 rounded-md overflow-hidden bg-secondary">
                    {mainImage && (
                        <Image src={mainImage.url} alt={car.model} fill className="object-cover" sizes="64px" />
                    )}
                </div>
                <div className="font-medium">
                    <div>{car.make} {car.model}</div>
                    <div className="text-xs text-muted-foreground">{car.id}</div>
                </div>
            </div>
        )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status: string = row.getValue('status') || 'Available';
      
      return (
        <Badge 
            variant={status === 'Sold' ? 'destructive' : status === 'Reserved' ? 'secondary' : 'default'}
            className={cn(status === 'Available' && 'bg-primary text-primary-foreground')}
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'year',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Año" />
    ),
    cell: ({ row }) => <Badge variant="secondary">{row.getValue('year')}</Badge>
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Precio" />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'USD',
      }).format(price);
 
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <VehiclesTableRowActions row={row} onDelete={onDelete} onStatusChange={onStatusChange} />,
  },
];
