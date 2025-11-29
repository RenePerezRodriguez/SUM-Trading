
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2, CheckCircle2, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const countryCodes = [
  { code: "+1", flag: "🇺🇸", name: "Estados Unidos" },
  { code: "+1", flag: "🇨🇦", name: "Canadá", value: "+1-CA" },
  { code: "+7", flag: "🇷🇺", name: "Rusia" },
  { code: "+20", flag: "🇪🇬", name: "Egipto" },
  { code: "+27", flag: "🇿🇦", name: "Sudáfrica" },
  { code: "+30", flag: "🇬🇷", name: "Grecia" },
  { code: "+31", flag: "🇳🇱", name: "Países Bajos" },
  { code: "+32", flag: "🇧🇪", name: "Bélgica" },
  { code: "+33", flag: "🇫🇷", name: "Francia" },
  { code: "+34", flag: "🇪🇸", name: "España" },
  { code: "+36", flag: "🇭🇺", name: "Hungría" },
  { code: "+39", flag: "🇮🇹", name: "Italia" },
  { code: "+40", flag: "🇷🇴", name: "Rumania" },
  { code: "+41", flag: "🇨🇭", name: "Suiza" },
  { code: "+43", flag: "🇦🇹", name: "Austria" },
  { code: "+44", flag: "🇬🇧", name: "Reino Unido" },
  { code: "+45", flag: "🇩🇰", name: "Dinamarca" },
  { code: "+46", flag: "🇸🇪", name: "Suecia" },
  { code: "+47", flag: "🇳🇴", name: "Noruega" },
  { code: "+48", flag: "🇵🇱", name: "Polonia" },
  { code: "+49", flag: "🇩🇪", name: "Alemania" },
  { code: "+51", flag: "🇵🇪", name: "Perú" },
  { code: "+52", flag: "🇲🇽", name: "México" },
  { code: "+53", flag: "🇨🇺", name: "Cuba" },
  { code: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "+55", flag: "🇧🇷", name: "Brasil" },
  { code: "+56", flag: "🇨🇱", name: "Chile" },
  { code: "+57", flag: "🇨🇴", name: "Colombia" },
  { code: "+58", flag: "🇻🇪", name: "Venezuela" },
  { code: "+60", flag: "🇲🇾", name: "Malasia" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "+63", flag: "🇵🇭", name: "Filipinas" },
  { code: "+64", flag: "🇳🇿", name: "Nueva Zelanda" },
  { code: "+65", flag: "🇸🇬", name: "Singapur" },
  { code: "+66", flag: "🇹🇭", name: "Tailandia" },
  { code: "+81", flag: "🇯🇵", name: "Japón" },
  { code: "+82", flag: "🇰🇷", name: "Corea del Sur" },
  { code: "+84", flag: "🇻🇳", name: "Vietnam" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+90", flag: "🇹🇷", name: "Turquía" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+92", flag: "🇵🇰", name: "Pakistán" },
  { code: "+93", flag: "🇦🇫", name: "Afganistán" },
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+95", flag: "🇲🇲", name: "Myanmar" },
  { code: "+98", flag: "🇮🇷", name: "Irán" },
  { code: "+212", flag: "🇲🇦", name: "Marruecos" },
  { code: "+213", flag: "🇩🇿", name: "Argelia" },
  { code: "+216", flag: "🇹🇳", name: "Túnez" },
  { code: "+218", flag: "🇱🇾", name: "Libia" },
  { code: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "+352", flag: "🇱🇺", name: "Luxemburgo" },
  { code: "+353", flag: "🇮🇪", name: "Irlanda" },
  { code: "+354", flag: "🇮🇸", name: "Islandia" },
  { code: "+355", flag: "🇦🇱", name: "Albania" },
  { code: "+370", flag: "🇱🇹", name: "Lituania" },
  { code: "+371", flag: "🇱🇻", name: "Letonia" },
  { code: "+372", flag: "🇪🇪", name: "Estonia" },
  { code: "+380", flag: "🇺🇦", name: "Ucrania" },
  { code: "+420", flag: "🇨🇿", name: "República Checa" },
  { code: "+421", flag: "🇸🇰", name: "Eslovaquia" },
  { code: "+501", flag: "🇧🇿", name: "Belice" },
  { code: "+502", flag: "🇬🇹", name: "Guatemala" },
  { code: "+503", flag: "🇸🇻", name: "El Salvador" },
  { code: "+504", flag: "🇭🇳", name: "Honduras" },
  { code: "+505", flag: "🇳🇮", name: "Nicaragua" },
  { code: "+506", flag: "🇨🇷", name: "Costa Rica" },
  { code: "+507", flag: "🇵🇦", name: "Panamá" },
  { code: "+509", flag: "🇭🇹", name: "Haití" },
  { code: "+591", flag: "🇧🇴", name: "Bolivia" },
  { code: "+593", flag: "🇪🇨", name: "Ecuador" },
  { code: "+595", flag: "🇵🇾", name: "Paraguay" },
  { code: "+598", flag: "🇺🇾", name: "Uruguay" },
  { code: "+852", flag: "🇭🇰", name: "Hong Kong" },
  { code: "+853", flag: "🇲🇴", name: "Macao" },
  { code: "+855", flag: "🇰🇭", name: "Camboya" },
  { code: "+856", flag: "🇱🇦", name: "Laos" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+886", flag: "🇹🇼", name: "Taiwán" },
  { code: "+961", flag: "🇱🇧", name: "Líbano" },
  { code: "+962", flag: "🇯🇴", name: "Jordania" },
  { code: "+963", flag: "🇸🇾", name: "Siria" },
  { code: "+964", flag: "🇮🇶", name: "Irak" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "+966", flag: "🇸🇦", name: "Arabia Saudita" },
  { code: "+967", flag: "🇾🇪", name: "Yemen" },
  { code: "+968", flag: "🇴🇲", name: "Omán" },
  { code: "+971", flag: "🇦🇪", name: "Emiratos Árabes Unidos" },
  { code: "+972", flag: "🇮🇱", name: "Israel" },
  { code: "+973", flag: "🇧🇭", name: "Baréin" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+998", flag: "🇺🇿", name: "Uzbekistán" },
];

const createContactSchema = (dict: any) => z.object({
  name: z.string().min(2, dict.name_required),
  email: z.string().email(dict.email_invalid),
  phoneCode: z.string().optional(),
  phone: z.string().min(7, dict.phone_invalid).optional().or(z.literal('')),
  subject: z.string().min(1, dict.subject_required),
  message: z.string().min(10, dict.message_short).max(1000),
});

const MAX_CHARS = 1000;

export default function ContactForm({ dict }: { dict: any }) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const validationDict = dict.validation;
  const [charCount, setCharCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [openCountryCode, setOpenCountryCode] = useState(false);

  const contactSchema = createContactSchema(validationDict);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneCode: '+52',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const { formState: { isSubmitting } } = form;

  const messageValue = form.watch('message');
  
  useEffect(() => {
    setCharCount(messageValue?.length || 0);
  }, [messageValue]);
  
  const getSmartSuggestion = (subject: string) => {
    if (!dict.smart_suggestions) return '';
    return dict.smart_suggestions[subject] || dict.smart_suggestions.general;
  };

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Firestore service is not available.",
      });
      return;
    }

    try {
      const contactFormCollection = collection(firestore, 'contact_form_entries');
      const fullPhone = values.phone ? `${values.phoneCode} ${values.phone}` : '';
      const newEntry = {
        ...values,
        phone: fullPhone,
        id: uuidv4(),
        submissionDate: new Date().toISOString(),
      };

      await addDocumentNonBlocking(contactFormCollection, newEntry);
      
      setShowSuccess(true);
      toast({
        title: dict.success,
        description: dict.success_desc,
      });

      form.reset();
      setCharCount(0);
      
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: dict.error,
        description: "There was an issue saving your message.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {showSuccess && (
          <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="h-5 w-5" />
            <p className="text-sm font-medium">{dict.success_desc}</p>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  {dict.name}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Juan Pérez" 
                    {...field} 
                    autoFocus
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  {dict.email}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="juan@ejemplo.com" 
                    {...field} 
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>{dict.phone}</FormLabel>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="phoneCode"
                render={({ field }) => (
                  <Popover open={openCountryCode} onOpenChange={setOpenCountryCode}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[130px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? countryCodes.find((country) => (country.value || country.code) === field.value)?.flag + " " + (countryCodes.find((country) => (country.value || country.code) === field.value)?.code)
                            : "🇲🇽 +52"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar país..." />
                        <CommandEmpty>No se encontró el país.</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-auto">
                          {countryCodes.map((country) => (
                            <CommandItem
                              value={country.name}
                              key={country.value || country.code}
                              onSelect={() => {
                                form.setValue("phoneCode", country.value || country.code);
                                setOpenCountryCode(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  (country.value || country.code) === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <span className="mr-2">{country.flag}</span>
                              <span>{country.name} {country.code}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder={dict.phone_placeholder} 
                      {...field} 
                      className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                )}
              />
            </div>
            <FormMessage />
          </FormItem>
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  {dict.subject}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedSubject(value);
                }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder={dict.subject_placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">{dict.subject_options.general}</SelectItem>
                    <SelectItem value="auction_advisory">{dict.subject_options.auction_advisory}</SelectItem>
                    <SelectItem value="quote">{dict.subject_options.quote}</SelectItem>
                    <SelectItem value="post_sale">{dict.subject_options.post_sale}</SelectItem>
                    <SelectItem value="import_process">{dict.subject_options.import_process}</SelectItem>
                    <SelectItem value="other">{dict.subject_options.other}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {selectedSubject && (
          <div className="bg-accent/5 border border-accent/30 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm text-accent">
              {getSmartSuggestion(selectedSubject)}
            </p>
          </div>
        )}
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                {dict.message}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={dict.message_placeholder} 
                  className="min-h-[150px] resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20" 
                  maxLength={MAX_CHARS}
                  {...field} 
                />
              </FormControl>
              <FormDescription className={`text-right transition-colors duration-200 ${
                charCount > MAX_CHARS * 0.9 ? 'text-orange-500' : 'text-muted-foreground'
              }`}>
                {MAX_CHARS - charCount} {dict.chars_remaining}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? dict.sending : dict.submit}
        </Button>
      </form>
    </Form>
  );
}
