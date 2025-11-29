
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { deleteAccountAction } from '../actions/delete-account-action';
import { Loader2 } from 'lucide-react';

export default function DeleteAccountForm({ dict, lang }: { dict: any; lang: string }) {
    const content = dict.profile_page.cards.account_settings;
    const { toast } = useToast();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        const result = await deleteAccountAction();
        
        if (result.success) {
            toast({
                title: content.delete_success_title,
                description: content.delete_success_desc,
            });
            router.push(`/${lang}`);
            router.refresh();
        } else {
            toast({
                variant: 'destructive',
                title: content.delete_error_title,
                description: result.error || content.delete_error_desc,
            });
        }
        setIsDeleting(false);
        setIsDialogOpen(false);
    };
    
    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">{content.delete_account_button}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{content.delete_account_dialog_title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {content.delete_account_dialog_desc}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>{content.cancel_button}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                         {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                         {content.delete_account_dialog_confirm}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
