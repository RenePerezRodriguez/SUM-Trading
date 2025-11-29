
"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { MixerHorizontalIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  dict: any;
}

export function DataTableViewOptions<TData>({
  table,
  dict
}: DataTableViewOptionsProps<TData>) {
    const t = dict.admin_data_table;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          {t.view}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>{t.toggle_columns}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            const headerKey = column.id === 'names' ? 'name' : column.id;
            const userTableDict = dict.admin_users_table || {};
            const vehicleTableDict = dict.admin_vehicles_table || {};
            
            const headerText = userTableDict[headerKey as keyof typeof userTableDict] || vehicleTableDict[headerKey as keyof typeof vehicleTableDict] || column.id;
            
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {headerText}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
