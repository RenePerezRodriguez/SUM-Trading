
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/components-registro/password-input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { updatePasswordAction } from '../actions/update-password-action';

const createPasswordSchema = (dict: any) => z.object({
    currentPassword: z.string().min(1, dict.profile_page.cards.account_settings.current_password_required),
    newPassword: z.string().min(6, dict.register_page.password_short),
    confirmPassword: z.string().min(6, dict.register_page.password_short),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: dict.register_page.passwords_no_match || "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

export default function ChangePasswordForm({ dict }: { dict: any }) {
    const [serverError, setServerError] = useState<string | null>(null);
    const { toast } = useToast();
    const t = dict.profile_page.cards.account_settings;
    const passwordSchema = createPasswordSchema(dict);
    
    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const { formState: { isSubmitting }, reset } = form;

    async function onSubmit(values: z.infer<typeof passwordSchema>) {
        setServerError(null);

        const formData = new FormData();
        formData.append('currentPassword', values.currentPassword);
        formData.append('newPassword', values.newPassword);

        const result = await updatePasswordAction(formData);

        if (result.success) {
            toast({
                title: t.password_success_title,
                description: t.password_success_desc,
            });
            reset();
        } else {
            setServerError(result.error || t.unknown_error);
        }
    }

    return (
        <Form {...form}>
            {serverError && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t.password_error_title}</AlertTitle>
                    <AlertDescription>{serverError}</AlertDescription>
                </Alert>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.current_password_label}</FormLabel>
                            <FormControl>
                                <PasswordInput {...field} placeholder="••••••••" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.new_password_label}</FormLabel>
                            <FormControl>
                                <PasswordInput {...field} placeholder="••••••••" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.confirm_new_password_label}</FormLabel>
                            <FormControl>
                                <PasswordInput {...field} placeholder="••••••••" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t.save_password_button}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
