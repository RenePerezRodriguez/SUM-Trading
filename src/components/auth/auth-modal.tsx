'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import useAuthModalStore from '@/hooks/use-auth-modal-store';
import LoginForm from './login-form';
import RegisterForm from './register-form';
import ForgotPasswordForm from './forgot-password-form';
import type { Locale } from '@/lib/i18n-config';
import { Button } from '@/components/ui/button';

export default function AuthModal({ dict, lang }: { dict: any; lang: Locale }) {
  const { isOpen, closeModal, view, openModal } = useAuthModalStore();

  const isLoginView = view === 'login';
  const isRegisterView = view === 'register';
  const isForgotPasswordView = view === 'forgotPassword';
  
  let title = '';
  let description = '';
  let linkText = '';
  let linkAction: 'login' | 'register' | 'forgotPassword' = 'login';
  
  if (isLoginView) {
      title = dict.login_page.title;
      description = dict.login_page.description;
      linkText = dict.login_page.register_link;
      linkAction = 'register';
  } else if (isRegisterView) {
      title = dict.register_page.title;
      description = dict.register_page.description;
      linkText = dict.register_page.login_link;
      linkAction = 'login';
  } else if (isForgotPasswordView) {
      title = dict.login_page.forgot_password_title;
      description = dict.login_page.forgot_password_desc;
      linkText = dict.login_page.back_to_login;
      linkAction = 'login';
  }


  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center mt-4">
          <DialogTitle className="text-2xl font-headline">
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}{' '}
            <Button variant="link" className="p-0 h-auto font-bold text-primary hover:underline cursor-pointer" onClick={() => openModal(linkAction)}>
                {linkText}
            </Button>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
            {isLoginView && <LoginForm dict={dict} lang={lang} />}
            {isRegisterView && <RegisterForm dict={dict} lang={lang} roleToAssign='user' />}
            {isForgotPasswordView && <ForgotPasswordForm dict={dict} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
