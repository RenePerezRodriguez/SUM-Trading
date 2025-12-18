
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/components-registro/password-input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { CreateUserResult } from '../actions';

type AdminRegisterFormProps = {
    dict: any;
    lang: string;
    createUserAction: (data: FormData) => Promise<CreateUserResult>;
}

export default function AdminRegisterForm({ dict, lang, createUserAction }: AdminRegisterFormProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = dict.admin_register_page;

  const formSchema = z.object({
    names: z.string().min(2, { message: dict.register_page.name_short }),
    firstLastName: z.string().min(2, { message: dict.register_page.last_name_short }),
    email: z.string().email({ message: dict.register_page.email_invalid }),
    password: z.string().min(6, { message: dict.register_page.password_short }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      names: '',
      firstLastName: '',
      email: '',
      password: '',
    },
    mode: 'onChange'
  });

  const { formState: { isSubmitting } } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('names', values.names);
    formData.append('firstLastName', values.firstLastName);

    const result = await createUserAction(formData);

    if (result.success) {
      toast({
        title: t.success_title,
        description: t.success_desc,
      });
      router.push(`/${lang}/admin/login`);
    } else {
      setError(result.error || dict.register_page.register_error_default);
    }
  }

  return (
    <FormProvider {...form}>
      {error && (
          <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{dict.register_page.error_title}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
          </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="names"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.register_page.names_label || 'Nombres'}</FormLabel>
                  <FormControl>
                    <Input placeholder={dict.register_page.names_placeholder || 'John'} {...field} />
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
                  <FormLabel>{dict.register_page.last_name_label || 'Primer Apellido'}</FormLabel>
                  <FormControl>
                    <Input placeholder={dict.register_page.last_name_placeholder || 'Doe'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                <FormLabel>{dict.login_page.password}</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? dict.register_page.loading : dict.register_page.register_button}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
