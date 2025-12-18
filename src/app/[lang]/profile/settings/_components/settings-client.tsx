'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, KeyRound, ShieldAlert } from 'lucide-react';
import ChangePasswordForm from './change-password-form';
import DeleteAccountForm from './delete-account-form';

export default function SettingsClient({ dict, lang }: { dict: any; lang: string }) {
  const content = dict.profile_page.cards.account_settings;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <KeyRound className="w-5 h-5 text-primary" />
            {content.change_password_title}
          </CardTitle>
          <CardDescription>{content.change_password_desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm dict={dict} />
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-destructive">
            <ShieldAlert className="w-5 h-5" />
            {content.danger_zone_title}
          </CardTitle>
          <CardDescription>{content.danger_zone_desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountForm dict={dict} lang={lang} />
        </CardContent>
      </Card>
    </div>
  );
}
