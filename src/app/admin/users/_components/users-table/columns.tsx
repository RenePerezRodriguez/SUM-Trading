
'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { UserProfile } from '@/lib/user-profile';
import { DataTableColumnHeader } from '@/app/admin/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { UsersTableRowActions } from './users-table-row-actions';

interface ColumnsProps {
    onChangeRole: (user: UserProfile, role: 'admin' | 'user') => void;
    onDelete: (user: UserProfile) => void;
    dict: any;
    lang: string;
}

export const columns = ({ onChangeRole, onDelete, dict, lang }: ColumnsProps): ColumnDef<UserProfile>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={dict.admin_data_table.select_all_aria}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={dict.admin_data_table.select_row_aria}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
          <div className="text-xs text-muted-foreground">{user.id}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dict.admin_users_table.email} />
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dict.admin_users_table.role} />
    ),
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      const roleText = dict.admin_users_table.roles[role as keyof typeof dict.admin_users_table.roles] || role;
      return (
        <Badge variant={role === 'admin' ? 'default' : 'secondary'} className="capitalize">
          {roleText}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'registrationDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dict.admin_users_table.registration_date} />
    ),
    cell: ({ row }) => {
      const date = row.getValue('registrationDate') as string;
      if (!date) return null;
      try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) return date; // return original string if date is invalid
        return format(parsedDate, "d 'de' MMMM, yyyy", { locale: lang === 'es' ? es : enUS });
      } catch (e) {
        return date;
      }
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <UsersTableRowActions row={row} onChangeRole={onChangeRole} onDelete={onDelete} dict={dict} />,
  },
];
