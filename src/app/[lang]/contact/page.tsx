import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import ContactForm from './_components/contact-form';
import ContactInfo from './_components/contact-info';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, Clock, FileText, Rocket, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FadeIn, StaggerContainer, FadeInItem } from '@/components/animations/fade-in';

type Props = {
    params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sumtrading.us';
    
    return {
      title: dict.contact_page.title,
      description: dict.contact_page.description,
      keywords: ['contacto SUM Trading', 'teléfono SUM Trading', 'email info@sumtrading.us', 'oficina Texas', 'asesoría vehículos', 'WhatsApp +1 956 747 6078'],
      alternates: {
        canonical: `${baseUrl}/${lang}/contact`,
        languages: {
          'en': `${baseUrl}/en/contact`,
          'es': `${baseUrl}/es/contact`,
        },
      },
      openGraph: {
        title: dict.contact_page.title,
        description: dict.contact_page.description,
        url: `${baseUrl}/${lang}/contact`,
        type: 'website',
      },
    };
}

export default async function ContactPage({ params }: Props) {
    const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = dict.contact_page;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sumtrading.us';
  const whatsappNumber = "19567476078";

  const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
          {
              "@type": "ListItem",
              "position": 1,
              "name": lang === 'es' ? 'Inicio' : 'Home',
              "item": `${baseUrl}/${lang}`
          },
          {
              "@type": "ListItem",
              "position": 2,
              "name": lang === 'es' ? 'Contacto' : 'Contact',
              "item": `${baseUrl}/${lang}/contact`
          }
      ]
  };
  const whatsappMessage = encodeURIComponent(content.whatsapp_message);
  
  const processIcons = [CheckCircle2, Clock, FileText, Rocket];
  
  const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48" className="h-6 w-6">
        <path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6	C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"></path><path fill="#fff" d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6	C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3	L5,43.8C5,43.8,4.9,43.8,4.9,43.8z"></path><path fill="#cfd8dc" d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3	L4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24	c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2	c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z"></path><path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8	l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"></path><path fill="#fff" fillRule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0	s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3	c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9	c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8	c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z" clipRule="evenodd"></path>
    </svg>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": content.title,
            "description": content.description,
            "mainEntity": {
              "@type": "Organization",
              "name": "SUM Trading",
              "telephone": "+1-956-747-6078",
              "email": "info@sumtrading.us",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "9675 Joe G Garza Sr Rd",
                "addressLocality": "Brownsville",
                "addressRegion": "TX",
                "postalCode": "78521",
                "addressCountry": "US"
              },
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+1-956-747-6078",
                  "contactType": "Customer Service",
                  "availableLanguage": ["English", "Spanish"],
                  "areaServed": ["US", "MX", "AR", "CL", "CO", "PE", "EC", "VE", "BO", "UY", "PY", "CR", "PA", "GT", "HN", "SV", "NI", "DO", "CU"]
                }
              ]
            }
          })
        }}
      />
    <div className="container py-8 md:py-12 pt-28 md:pt-44">
      <FadeIn>
        <PageHeader 
            title={content.title}
            description={content.description}
        />
      </FadeIn>
      
      {/* Process Timeline */}
      {content.process_timeline && (
        <FadeIn className="max-w-6xl mx-auto mb-12" delay={0.1}>
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="font-headline text-center text-2xl">{content.process_timeline.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {content.process_timeline.steps.map((step: any, index: number) => {
                  const Icon = processIcons[index];
                  const isEven = index % 2 === 0;
                  return (
                    <div key={index} className="relative">
                      <div className={`flex flex-col items-center text-center space-y-3 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md ${
                        isEven 
                          ? 'bg-primary/5 hover:bg-primary/10' 
                          : 'bg-accent/5 hover:bg-accent/10'
                      }`}>
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          isEven 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-accent/10 text-accent'
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <Badge variant="outline" className={`mb-2 text-xs ${
                            isEven 
                              ? 'border-primary/50 text-primary' 
                              : 'border-accent/50 text-accent'
                          }`}>
                            {step.label}
                          </Badge>
                          <h4 className="font-semibold text-sm">{step.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{step.time}</p>
                        </div>
                      </div>
                      {index < 3 && (
                        <div className={`hidden md:block absolute top-10 -right-2 w-4 h-0.5 ${
                          isEven ? 'bg-primary/30' : 'bg-accent/30'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}
      
      <StaggerContainer className="grid md:grid-cols-2 gap-8 md:gap-16 items-start max-w-6xl mx-auto">
        <FadeInItem className="order-2 md:order-1 space-y-6">
            <Card className="transition-shadow duration-300 hover:shadow-lg border border-border/50 bg-gradient-to-b from-background to-accent/5">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{content.form_title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ContactForm dict={{ ...content, validation: dict.validation }} />
                </CardContent>
            </Card>
            
            {/* WhatsApp Button */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
                      <WhatsAppIcon />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{content.whatsapp_button}</h3>
                    <p className="text-sm text-muted-foreground">
                      {lang === 'es' ? 'Respuesta inmediata' : 'Immediate response'}
                    </p>
                  </div>
                  <Button 
                    asChild
                    className="bg-green-500 hover:bg-green-600 text-white transition-all duration-200 hover:scale-105 h-11 sm:h-12 text-sm sm:text-base px-5 sm:px-6"
                  >
                    <a 
                      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <WhatsAppIcon />
                      <span>{lang === 'es' ? 'Abrir Chat' : 'Open Chat'}</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Chat Widget - Coming Soon */}
            {content.chat_widget && (
              <Card className="relative overflow-hidden bg-gradient-to-br from-accent/5 to-accent/10 border-accent/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{content.chat_widget.title}</h3>
                        <Badge variant="secondary" className="text-xs">{content.chat_widget.coming_soon}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {content.chat_widget.subtitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
        </FadeInItem>
        
        <FadeInItem className="order-1 md:order-2 space-y-6">
          <ContactInfo dict={dict} />
        </FadeInItem>
      </StaggerContainer>
      
      {/* Quick FAQ Section */}
      <FadeIn className="max-w-6xl mx-auto mt-16" delay={0.3}>
        <Card className="transition-shadow duration-300 hover:shadow-lg border border-border/50 bg-gradient-to-b from-background to-accent/5">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{content.quick_faq_title}</CardTitle>
            <CardDescription>
              {lang === 'es' 
                ? 'Las respuestas a las dudas más comunes' 
                : 'Answers to the most common questions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {content.quick_faqs.map((faq: any, index: number) => (
                <AccordionItem key={index} value={`item-${index}`} className="transition-colors duration-200">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors duration-200">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-6 text-center">
              <Button variant="outline" asChild className="transition-all duration-200 hover:scale-105">
                <Link href={`/${lang}/faq`}>
                  {content.quick_faq_cta}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
    </>
  );
}
