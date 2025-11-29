
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import RegisterFormFields from '@/components/components-registro/register-form-fields';
import useAuthModalStore from '@/hooks/use-auth-modal-store';
import { createUser } from '@/app/[lang]/auth/register/actions';
import { sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { isValidPhoneNumber } from 'react-phone-number-input';


type RegisterFormProps = {
    dict: any;
    lang: string;
    roleToAssign: 'admin' | 'user';
}

export default function RegisterForm({ dict, lang, roleToAssign }: RegisterFormProps) {
  const { toast } = useToast();
  const auth = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const { closeModal, isOpen } = useAuthModalStore();
  const t_register = dict.register_page;
  const t_email_verify = dict.email_verification;

  const formSchema = z.object({
    names: z.string().min(2, { message: t_register.name_short }),
    firstLastName: z.string().min(2, { message: t_register.last_name_short }),
    secondLastName: z.string().optional(),
    phoneNumber: z.string().refine(isValidPhoneNumber, { message: t_register.phone_invalid }),
    country: z.string().min(2, { message: t_register.country_required }),
    email: z.string().email({ message: t_register.email_invalid }),
    password: z.string().min(6, { message: t_register.password_short }),
    confirmPassword: z.string().min(6, { message: t_register.password_short }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t_register.passwords_no_match || "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      names: '',
      firstLastName: '',
      secondLastName: '',
      phoneNumber: '',
      country: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onChange'
  });

  const { trigger, formState: { isSubmitting } } = form;

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
        isValid = await trigger(["names", "firstLastName", "phoneNumber", "country"]);
    }
    
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    if (!auth) {
        setError("Firebase services are not available.");
        return;
    }

    try {
        const result = await createUser({
            email: values.email,
            password: values.password,
            displayName: `${values.names} ${values.firstLastName}`,
            names: values.names,
            firstLastName: values.firstLastName,
            secondLastName: values.secondLastName,
            phoneNumber: values.phoneNumber,
            country: values.country,
            role: roleToAssign,
        });

        if (!result.success) {
            throw new Error(result.error || t_register.register_error_default);
        }

        // After creating user on the server, sign them in on the client to send verification
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        await sendEmailVerification(userCredential.user);
        
        toast({
            title: t_register.register_success_title,
            description: t_register.register_success_desc,
        });

        toast({
            title: t_email_verify.title,
            description: t_email_verify.description,
            duration: 10000,
        });
        
        // Sign out user after sending verification, so they have to verify to log in.
        await auth.signOut();

        if (isOpen) closeModal();

        if (roleToAssign === 'admin') {
            router.push(`/${lang}/admin/login`);
        } else {
            router.push(`/${lang}/login`);
        }
        router.refresh();

    } catch (e: any) {
        console.error("Registration Error: ", e);
        let errorMessage = t_register.register_error_default;
        if (e.message.includes('auth/email-already-in-use') || e.message.includes('email-already-exists')) {
            errorMessage = t_register.register_error_email_in_use;
        } else {
            errorMessage = e.message || errorMessage;
        }
        setError(errorMessage);
    }
}

  return (
    <FormProvider {...form}>
      {error && (
          <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t_register.error_title}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
          </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="text-center text-sm text-muted-foreground mb-4">
            {t_register.step_of.replace('{current}', currentStep).replace('{total}', '2')}
          </div>

          <RegisterFormFields dict={dict} currentStep={currentStep} />
          
          <div className="flex gap-4 pt-4">
            {currentStep === 2 && (
              <Button type="button" variant="outline" onClick={handlePrevStep} className="w-full" disabled={isSubmitting}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t_register.back_button}
              </Button>
            )}
            
            {currentStep === 1 ? (
              <Button type="button" onClick={handleNextStep} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {t_register.next_button}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? t_register.loading : t_register.register_button}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
