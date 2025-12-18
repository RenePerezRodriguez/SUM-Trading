
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/components-registro/password-input';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, User, sendEmailVerification } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import useAuthModalStore from '@/hooks/use-auth-modal-store';
import { createUser } from '@/app/[lang]/auth/register/actions';
import Image from 'next/image';

export default function LoginForm({ dict, lang, isAdminLogin = false }: { dict: any, lang: string, isAdminLogin?: boolean }) {
  const { toast } = useToast();
  const auth = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { closeModal, isOpen, openModal, redirectUrl } = useAuthModalStore();
  const t_login = dict.login_page;
  const t_email_verify = dict.email_verification;

  const formSchema = z.object({
    email: z.string().email({ message: t_login.email_invalid }),
    password: z.string().min(1, { message: t_login.password_required }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleResendVerificationEmail = async () => {
    if (auth?.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        toast({
          title: t_email_verify.resent_success_title,
          description: t_email_verify.resent_success_desc,
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: t_email_verify.resent_error_title,
          description: (error as Error).message,
        });
      }
    }
  };

  async function handleLoginSuccess(user: User, profileNeedsUpdate?: boolean) {
    if (!user.emailVerified && user.providerData.some(p => p.providerId === 'password')) {
        toast({
            title: t_email_verify.title,
            description: t_email_verify.description,
            duration: 10000,
            action: (
              <Button variant="outline" size="sm" onClick={handleResendVerificationEmail}>
                {t_email_verify.resend_button}
              </Button>
            ),
        });
        return; // Don't proceed with login if email is not verified
    }
    
    // Always close modal on successful auth action
    if (isOpen) closeModal();

    if (profileNeedsUpdate) {
        toast({
            title: dict.complete_profile_page.title,
            description: dict.complete_profile_page.description,
        });

        // Use the redirectUrl from the store if it exists, otherwise use the one from localStorage
        const finalRedirectUrl = redirectUrl || localStorage.getItem('redirectAfterLogin');
        if (finalRedirectUrl) {
            localStorage.setItem('redirectAfterProfileCompletion', finalRedirectUrl);
        }
        localStorage.removeItem('redirectAfterLogin'); // Clean up old one

        router.push(`/${lang}/auth/complete-profile`);
        return;
    }


    toast({
        title: t_login.success_title,
        description: `${t_login.success_desc} ${user.displayName || user.email}`,
    });
    
    const finalRedirectUrl = redirectUrl || localStorage.getItem('redirectAfterLogin');
    localStorage.removeItem('redirectAfterLogin');

    if(finalRedirectUrl) {
      router.push(finalRedirectUrl);
    } else {
      const idTokenResult = await user.getIdTokenResult();
      if(idTokenResult.claims.role === 'admin') {
        router.push(`/${lang}/admin`);
      } else {
        router.push(`/${lang}/profile`);
      }
    }
    router.refresh();
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setIsLoading(true);
    if (!auth) {
        setError("Firebase auth service not available.");
        setIsLoading(false);
        return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      // We need to check if profile needs update after login
      const result = await createUser({ email: userCredential.user.email!, role: 'user' });
      await handleLoginSuccess(userCredential.user, result.profileNeedsUpdate);
    } catch (e: any) {
        let errorMessage = t_login.error_generic;
        if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
            errorMessage = t_login.error_invalid_credentials;
        }
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  }

  async function handleProviderSignIn(provider: GoogleAuthProvider) {
    setError(null);
    setIsGoogleLoading(true);
    
    if (!auth) {
        setError(t_login.error_generic);
        setIsGoogleLoading(false);
        return;
    }

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const creationResult = await createUser({
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName,
            role: 'user',
            // Pass phone if available from provider
            phoneNumber: user.phoneNumber || '',
        });

        if (!creationResult.success && !creationResult.userExists) {
            throw new Error(creationResult.error || 'Failed to sync user profile.');
        }

        await handleLoginSuccess(user, creationResult.profileNeedsUpdate);

    } catch (e: any) {
        let errorMessage = t_login.error_generic;
        if (e.code === 'auth/popup-closed-by-user') {
            errorMessage = t_login.error_popup_closed;
        } else if (e.code === 'auth/account-exists-with-different-credential') {
            errorMessage = "An account already exists with the same email address but different sign-in credentials. Please sign in using a different method.";
        }
        setError(errorMessage);
    } finally {
        setIsGoogleLoading(false);
    }
  }


  const handleForgotPassword = () => {
    openModal('forgotPassword');
  }

  const anyLoading = isLoading || isGoogleLoading;

  return (
    <div className="space-y-4">
        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t_login.error_title}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>{dict.contact_page.email}</FormLabel>
                    <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem>
                    <div className="flex justify-between items-center">
                        <FormLabel>{t_login.password}</FormLabel>
                        <Button type="button" variant="link" size="sm" className="h-auto p-0" onClick={handleForgotPassword}>
                            {t_login.forgot_password}
                        </Button>
                    </div>
                    <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={anyLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? t_login.loading : t_login.login_button}
            </Button>
            </form>
        </Form>

        {!isAdminLogin && (
            <>
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">{dict.register_page.continue_with}</span>
                    </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => handleProviderSignIn(new GoogleAuthProvider())} disabled={anyLoading}>
                    {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Image src="/images/logos/google.svg" width={16} height={16} alt="Google" className="mr-2" style={{ pointerEvents: 'none' }} />}
                    Google
                </Button>
            </>
        )}
    </div>
  );
}
