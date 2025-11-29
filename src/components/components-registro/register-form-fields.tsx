'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/components-registro/password-input';
import { PhoneInput } from './phone-input';
import { CountryCombobox } from './country-combobox';

export default function RegisterFormFields({ dict, currentStep }: { dict: any; currentStep: number }) {
  const { control } = useFormContext();
  const t = dict.register_page;

  return (
    <div className="space-y-3">
      {currentStep === 1 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              control={control}
              name="names"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.names_label || 'Nombres'}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.names_placeholder || 'John'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="firstLastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.last_name_label || 'Primer Apellido'}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.last_name_placeholder || 'Doe'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="secondLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.second_last_name_label || 'Segundo Apellido (Opcional)'}</FormLabel>
                <FormControl>
                  <Input placeholder={t.second_last_name_placeholder || 'Smith'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t.country_label || 'País'}</FormLabel>
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
              control={control}
              name="phoneNumber"
              render={({ field }) => (
              <FormItem>
                  <FormLabel>{t.phone_label || 'Número de Teléfono'}</FormLabel>
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
        </>
      )}

      {currentStep === 2 && (
        <>
          <FormField
            control={control}
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
            control={control}
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
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.confirm_password_label || 'Confirmar Contraseña'}</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}
