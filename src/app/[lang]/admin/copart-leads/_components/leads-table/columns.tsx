
'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { UserProfile } from '@/lib/user-profile';
import { DataTableColumnHeader } from '@/app/admin/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { LeadsTableRowActions } from './leads-table-row-actions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';

interface ColumnsProps {
    onStatusChange: (user: UserProfile, status: 'active' | 'in-progress' | 'finished' | 'whatsapp-inquiry') => void;
    dict: any;
    lang: string;
}

const statusConfig = {
    active: { variant: 'default' as const, className: 'bg-blue-500 hover:bg-blue-600' },
    'in-progress': { variant: 'secondary' as const, className: 'bg-yellow-500 hover:bg-yellow-600 text-black' },
    finished: { variant: 'destructive' as const, className: '' },
    'whatsapp-inquiry': { variant: 'secondary' as const, className: 'bg-green-100 text-green-700 hover:bg-green-200' }
};

export const columns = ({ onStatusChange, dict, lang }: ColumnsProps): ColumnDef<UserProfile>[] => [
  {
    accessorKey: 'names',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dict.admin_users_table.name} />
    ),
    cell: ({ row }) => {
      const user = row.original;
      const fullName = `${user.names} ${user.firstLastName} ${user.secondLastName || ''}`.trim();
      return (
        <div>
          <div className="font-medium">{fullName}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
      );
    },
  },
  {
    id: 'vehicleCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vehículos" />
    ),
    cell: ({ row }) => {
        const lead = row.original;
        const itemCount = lead.copartConsultation?.purchase?.items?.length || 0;
        return (
            <div className="text-center">
                <Badge variant="outline">{itemCount}</Badge>
            </div>
        );
    }
  },
  {
    accessorKey: 'copartConsultation.activationDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Activación" />
    ),
    cell: ({ row }) => {
      const date = row.original.copartConsultation?.activationDate;
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
    accessorKey: 'copartConsultation.status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const lead = row.original;
      const currentStatus = lead.copartConsultation?.status || 'active';
      const statusText = dict.admin_copart_leads_page.status_types[currentStatus] || currentStatus;
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
                {Object.keys(dict.admin_copart_leads_page.status_types).map((status) => (
                    <DropdownMenuItem
                        key={status}
                        onClick={() => onStatusChange(lead, status as any)}
                        disabled={currentStatus === status}
                    >
                        {dict.admin_copart_leads_page.status_types[status]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    filterFn: (row, id, value) => {
      const status = row.original.copartConsultation?.status || 'active';
      return value.includes(status);
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <LeadsTableRowActions user={row.original} onStatusChange={onStatusChange} dict={dict} />,
  },
];
