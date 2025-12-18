
"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { UserProfile } from "@/lib/user-profile"

interface UsersTableRowActionsProps {
  row: Row<UserProfile>
  onChangeRole: (user: UserProfile, role: 'admin' | 'user') => void;
  onDelete: (user: UserProfile) => void;
  dict: any;
}

export function UsersTableRowActions({
  row,
  onChangeRole,
  onDelete,
  dict,
}: UsersTableRowActionsProps) {
  const user = row.original

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
         <DropdownMenuSub>
          <DropdownMenuSubTrigger>Cambiar Rol</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => onChangeRole(user, 'admin')} disabled={user.role === 'admin'}>
                Administrador
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeRole(user, 'user')} disabled={user.role === 'user'}>
                Usuario
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
