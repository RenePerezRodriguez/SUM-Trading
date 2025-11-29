'use client';

import { useEffect, useState } from 'react';
import type { UserProfile } from '@/lib/user-profile';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { DataTable } from '@/app/admin/components/data-table';
import { columns } from './users-table/columns';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { setRole, getUsers, deleteUser as deleteUserAction } from '../actions';
import { useUser } from '@/firebase';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type RoleChangeState = {
    user: UserProfile;
    newRole: 'admin' | 'user';
} | null;


export default function UsersClient({ dict, lang }: { dict: any; lang: string }) {
  const { toast } = useToast();
  const { user: currentUser } = useUser();
  const [roleChangeState, setRoleChangeState] = useState<RoleChangeState>(null);
  const [usersToDelete, setUsersToDelete] = useState<UserProfile[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = dict.admin_users_page;

  useEffect(() => {
    const fetchUsers = async () => {
        if (!currentUser) return;

        setIsLoading(true);
        setError(null);
        try {
            const idToken = await currentUser.getIdToken(true);
            const result = await getUsers(idToken);
            if (result.success && result.data) {
                setUsers(result.data);
            } else {
                throw new Error(result.error || t.fetch_error_unknown);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    if(currentUser) {
        fetchUsers();
    }
  }, [currentUser, t.fetch_error_unknown]);

  const handleRoleChange = async () => {
    if (!roleChangeState || !currentUser) return;

    const { user, newRole } = roleChangeState;

    try {
        const idToken = await currentUser.getIdToken(true);
        const result = await setRole(idToken, user.id, newRole);

        if (result.success) {
            setUsers(currentUsers => currentUsers.map(u => u.id === user.id ? { ...u, role: newRole } : u));
            toast({
                title: t.role_change_success_title,
                description: t.role_change_success_desc.replace('{email}', user.email).replace('{role}', newRole),
            });
        } else {
            throw new Error(result.error || t.role_change_error_title);
        }
    } catch(e: any) {
         toast({
            variant: "destructive",
            title: t.role_change_error_title,
            description: e.message,
        });
    } finally {
        setRoleChangeState(null);
    }
  };
  
  const handleDeleteUsers = async () => {
    if (usersToDelete.length === 0 || !currentUser) return;

    const usersToDeleteFiltered = usersToDelete.filter(user => {
        if (currentUser?.uid === user.id) {
            toast({
                variant: "destructive",
                title: t.delete_error_title,
                description: t.delete_error_self,
            });
            return false;
        }
        return true;
    });

    if (usersToDeleteFiltered.length === 0) {
        setUsersToDelete([]);
        return;
    }
    
    const successes: UserProfile[] = [];
    const failures: { user: UserProfile, error: string }[] = [];
    const idToken = await currentUser.getIdToken(true);

    for (const user of usersToDeleteFiltered) {
        try {
            const result = await deleteUserAction(idToken, user.id);
            if (result.success) {
                successes.push(user);
            } else {
                throw new Error(result.error || t.delete_error_unknown);
            }
        } catch(e: any) {
            failures.push({ user, error: e.message });
        }
    }

    if (successes.length > 0) {
        setUsers(currentUsers => currentUsers.filter(u => !successes.some(s => s.id === u.id)));
        toast({
            title: successes.length > 1 ? t.delete_success_title_many : t.delete_success_title_one,
            description: t.delete_success_desc.replace('{count}', successes.length.toString())
        });
    }

    if (failures.length > 0) {
        const errorMessages = failures.map(f => `${f.user.email}: ${f.error}`).join('; ');
        toast({
            variant: "destructive",
            title: t.delete_error_title,
            description: errorMessages,
        });
    }

    setUsersToDelete([]);
  };

  const tableColumns = columns({ 
    onChangeRole: (user, role) => setRoleChangeState({ user, newRole: role }),
    onDelete: (user) => setUsersToDelete([user]),
    dict: dict,
    lang: lang
  });

  if (isLoading) {
    return (
        <div className="container py-12">
            <PageHeader title={dict.admin_page.actions.manage_users.title} description={dict.admin_page.actions.manage_users.description} />
            <div className="space-y-4 max-w-4xl mx-auto">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="container py-12 max-w-4xl mx-auto">
             <PageHeader title={t.fetch_error_title} description={t.fetch_error_desc} />
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t.server_error_title}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    )
  }
  
  return (
    <>
      <div className="container py-12">
        <PageHeader title={dict.admin_page.actions.manage_users.title} description={dict.admin_page.actions.manage_users.description} />
        <div className="mb-6 flex justify-start items-center max-w-4xl mx-auto">
          <Button asChild variant="outline">
            <Link href={`/${lang}/admin`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.back_to_panel}
            </Link>
          </Button>
        </div>
        <div className="max-w-4xl mx-auto">
            <DataTable 
                columns={tableColumns} 
                data={users || []}
                filterColumnId='email'
                filterPlaceholder={t.filter_placeholder}
                dict={dict}
            >
              {(table) => {
                  const numSelected = table.getFilteredSelectedRowModel().rows.length;
                  if (numSelected === 0) return null;
                  return (
                      <Button
                          variant="destructive"
                          className="ml-2"
                          onClick={() => setUsersToDelete(table.getFilteredSelectedRowModel().rows.map((row) => row.original))}
                      >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t.delete_button} ({numSelected})
                      </Button>
                  );
              }}
            </DataTable>
        </div>
      </div>

      <AlertDialog open={!!roleChangeState} onOpenChange={(open) => !open && setRoleChangeState(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.dialog_role.title}</AlertDialogTitle>
            <AlertDialogDescription dangerouslySetInnerHTML={{ __html: t.dialog_role.description.replace('{email}', `<b>${roleChangeState?.user.email}</b>`).replace('{role}', `<b>${roleChangeState?.newRole}</b>`) }} />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.dialog_cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRoleChange}>
              {t.dialog_role.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={usersToDelete.length > 0} onOpenChange={(open) => !open && setUsersToDelete([])}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{t.dialog_delete.title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {t.dialog_delete.description.replace('{count}', usersToDelete.length.toString())}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>{t.dialog_cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUsers} className="bg-destructive hover:bg-destructive/90">
                    {t.dialog_delete.confirm}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
