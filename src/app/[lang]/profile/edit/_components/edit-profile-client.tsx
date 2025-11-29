
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/user-profile';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { updateProfileAction } from '../actions/update-profile-action';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { PhoneInput } from '@/components/components-registro/phone-input';
import { CountryCombobox } from '@/components/components-registro/country-combobox';
import { isValidPhoneNumber } from 'react-phone-number-input';

const createProfileSchema = (dict: any) => z.object({
    names: z.string().min(2, dict.register_page.name_short),
    firstLastName: z.string().min(2, dict.register_page.last_name_short),
    secondLastName: z.string().optional(),
    phoneNumber: z.string().refine(isValidPhoneNumber, { message: dict.register_page.phone_invalid }),
    country: z.string().min(2, dict.register_page.country_required), // Expecting country code
});

function EditProfileSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-32 ml-auto" />
        </div>
    )
}


export default function EditProfileClient({ dict }: { dict: any }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [serverError, setServerError] = useState<string | null>(null);
    const t_profile_page = dict.profile_page;

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

    const profileSchema = createProfileSchema(dict);

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            names: '',
            firstLastName: '',
            secondLastName: '',
            phoneNumber: '',
            country: '',
        },
    });

    const { formState: { isSubmitting, isDirty } } = form;

    useEffect(() => {
        if (userProfile) {
            form.reset({
                names: userProfile.names || '',
                firstLastName: userProfile.firstLastName || '',
                secondLastName: userProfile.secondLastName || '',
                phoneNumber: userProfile.phoneNumber || '',
                country: userProfile.country || '',
            });
        }
    }, [userProfile, form]);
    
    async function onSubmit(values: z.infer<typeof profileSchema>) {
        if (!user) return;
        setServerError(null);

        const result = await updateProfileAction({
            userId: user.uid,
            ...values,
            phone: values.phoneNumber, // Map form field to action parameter
        });

        if (result.success) {
            toast({
                title: t_profile_page.update_success_title,
                description: t_profile_page.update_success_desc,
            });
            form.reset(values); // Reset to new values to make the form non-dirty
        } else {
            setServerError(result.error || t_profile_page.unknown_error);
        }
    }

    if (isProfileLoading || !userProfile) {
        return <EditProfileSkeleton />;
    }

    return (
        <Form {...form}>
            {serverError && (
                 <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t_profile_page.update_error_title}</AlertTitle>
                    <AlertDescription>{serverError}</AlertDescription>
                </Alert>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="names"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{dict.register_page.names_label}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="firstLastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{dict.register_page.last_name_label}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="secondLastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{dict.register_page.second_last_name_label}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>{dict.register_page.country_label}</FormLabel>
                            <CountryCombobox
                                value={field.value}
                                onChange={field.onChange}
                                dict={dict}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{dict.register_page.phone_label}</FormLabel>
                        <FormControl>
                            <PhoneInput
                                international
                                defaultCountry="US"
                                className="input"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting || !isDirty}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t_profile_page.save_changes_button}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
