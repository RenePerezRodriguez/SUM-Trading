
'use client';

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import type { UserProfile } from "@/lib/user-profile";

interface UsersTableRowActionsProps {
  user: UserProfile;
  onChangeRole: (user: UserProfile, role: 'admin' | 'user') => void;
  onDelete: (user: UserProfile) => void;
  dict: any;
}

export function UsersTableRowActions({
  user,
  onChangeRole,
  onDelete,
  dict
}: UsersTableRowActionsProps) {
  const t = dict.admin_users_table;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">{t.open_menu}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
         <DropdownMenuSub>
          <DropdownMenuSubTrigger>{t.change_role}</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => onChangeRole(user, 'admin')} disabled={user.role === 'admin'}>
                {t.roles.admin}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeRole(user, 'user')} disabled={user.role === 'user'}>
                {t.roles.user}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(user)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
          {t.delete}
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
