'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import useAuthModalStore from '@/hooks/use-auth-modal-store';

export default function ForgotPasswordForm({ dict }: { dict: any }) {
  const { toast } = useToast();
  const auth = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { openModal } = useAuthModalStore();
  const t = dict.login_page;

  const formSchema = z.object({
    email: z.string().email({ message: t.email_invalid }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const { formState: { isSubmitting } } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setIsSuccess(false);

    if (!auth) {
      setError("Firebase auth service not available.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, values.email);
      setIsSuccess(true);
      toast({
        title: t.forgot_password_success_title,
        description: t.forgot_password_success_desc,
      });
      form.reset();
      setTimeout(() => openModal('login'), 3000);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t.forgot_password_error_title}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {isSuccess && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t.forgot_password_success_title}</AlertTitle>
          <AlertDescription>{t.forgot_password_success_desc}</AlertDescription>
        </Alert>
      )}
      {!isSuccess && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? t.forgot_password_loading : t.forgot_password_button}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
