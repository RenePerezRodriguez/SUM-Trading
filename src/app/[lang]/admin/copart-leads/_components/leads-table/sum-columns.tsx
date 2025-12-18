'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { SumLead } from '@/lib/schemas';
import { DataTableColumnHeader } from '@/app/admin/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { SumLeadsTableRowActions } from './sum-leads-table-row-actions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';

interface ColumnsProps {
    onStatusChange: (lead: SumLead, status: 'active' | 'in-progress' | 'finished' | 'whatsapp-inquiry') => void;
    dict: any;
    lang: string;
}

const statusConfig = {
    active: { variant: 'default' as const, className: 'bg-blue-500 hover:bg-blue-600' },
    'in-progress': { variant: 'secondary' as const, className: 'bg-yellow-500 hover:bg-yellow-600 text-black' },
    finished: { variant: 'destructive' as const, className: 'bg-gray-500 hover:bg-gray-600' },
    'whatsapp-inquiry': { variant: 'secondary' as const, className: 'bg-green-100 text-green-700 hover:bg-green-200' }
};

export const sumColumns = ({ onStatusChange, dict, lang }: ColumnsProps): ColumnDef<SumLead>[] => [
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dict.admin_users_table.name} />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user) return <div className="text-muted-foreground">Usuario no encontrado</div>;

      const fullName = `${user.names} ${user.firstLastName} ${user.secondLastName || ''}`.trim();
      return (
        <div>
          <div className="font-medium">{fullName}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
        const user = row.original.user;
        if (!user) return false;
        const searchableText = `${user.names} ${user.firstLastName} ${user.secondLastName || ''} ${user.email}`.toLowerCase();
        return searchableText.includes(String(value).toLowerCase());
    }
  },
  {
    id: 'vehicleCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vehículos" />
    ),
    cell: ({ row }) => {
        const lead = row.original;
        const itemCount = lead.vehicles?.length || 0;
        return (
            <div className="text-center">
                <Badge variant="outline">{itemCount}</Badge>
            </div>
        );
    }
  },
  {
    accessorKey: 'submissionDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Solicitud" />
    ),
    cell: ({ row }) => {
      const date = row.original.submissionDate;
      if (!date) return null;
      try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) return date;
        return format(parsedDate, "d MMM, yyyy 'a las' HH:mm", { locale: lang === 'es' ? es : enUS });
      } catch (e) {
        return date;
      }
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const lead = row.original;
      const currentStatus = lead.status || 'active';
      const statusText = dict.admin_leads_page.status_types[currentStatus] || currentStatus;
      const config = statusConfig[currentStatus];

      return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={config.variant} className={cn("capitalize", config.className)}>
                    {statusText}
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {Object.keys(dict.admin_leads_page.status_types).map((status) => (
                    <DropdownMenuItem
                        key={status}
                        onClick={() => onStatusChange(lead, status as any)}
                        disabled={currentStatus === status}
                    >
                        {dict.admin_leads_page.status_types[status]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.original.status);
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <SumLeadsTableRowActions lead={row.original} onStatusChange={(status) => onStatusChange(row.original, status)} dict={dict} />,
  },
];
