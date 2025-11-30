
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { updateProfileAction } from '@/app/[lang]/profile/edit/actions/update-profile-action';
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

function CompleteProfileSkeleton() {
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
            <Skeleton className="h-10 w-32 ml-auto" />
        </div>
    )
}

export default function CompleteProfileForm({ dict, lang }: { dict: any, lang: string }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const t = dict.complete_profile_page;

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
            names: values.names,
            firstLastName: values.firstLastName,
            secondLastName: values.secondLastName,
            phone: values.phoneNumber,
            country: values.country,
        });
        
        if (result.success) {
            toast({
                title: t.success_title,
                description: t.success_desc,
            });
             // Check for a redirect URL, otherwise go to profile
             const redirectUrl = localStorage.getItem('redirectAfterProfileCompletion');
             localStorage.removeItem('redirectAfterProfileCompletion'); // Clean up
             
             // Use replace instead of push to avoid back button issues
             if (redirectUrl) {
                 router.replace(redirectUrl);
             } else {
                 router.replace(`/${lang}/profile`);
             }
        } else {
            setServerError(result.error || t.error_title);
        }
    }

    if (isProfileLoading || !userProfile) {
        return <CompleteProfileSkeleton />;
    }

    return (
        <Form {...form}>
            {serverError && (
                 <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t.error_title}</AlertTitle>
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
                    <Button type="submit" disabled={isSubmitting || !isDirty} className="w-full">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t.save_button}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
