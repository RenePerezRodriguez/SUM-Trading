"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

import { Car } from "@/lib/placeholder-data"
import { usePathname } from "next/navigation"
import { carStatusTypes } from "@/lib/schemas"

interface VehiclesTableRowActionsProps<TData> {
  row: Row<TData>
  onDelete: (car: Car) => void;
  onStatusChange: (car: Car, status: 'Available' | 'Reserved' | 'Sold') => void;
}

export function VehiclesTableRowActions<TData>({
  row,
  onDelete,
  onStatusChange,
}: VehiclesTableRowActionsProps<TData>) {
  const car = row.original as Car
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'es';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/admin/vehicles/edit/${car.id}`}>Editar</Link>
        </DropdownMenuItem>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Cambiar Estado</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {carStatusTypes.map((status) => (
                <DropdownMenuItem 
                  key={status} 
                  onClick={() => onStatusChange(car, status)}
                  disabled={car.status === status}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(car)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
          Eliminar
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
