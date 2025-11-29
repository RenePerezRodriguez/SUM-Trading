'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, ChevronRight, Search, MessageCircle, Car, DollarSign, Package, Wrench, FileText, Globe } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from './section-header';
import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categoryIcons: Record<string, any> = {
  'proceso-compra': Car,
  'costos-pagos': DollarSign,
  'logistica-importacion': Package,
  'reparaciones': Wrench,
  'documentacion': FileText,
  'sobre-sum': Globe,
};

export default function FaqSection({ dict, lang }: { dict: any, lang: string }) {
  const faqContent = dict.faq;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  // Filtrar preguntas según búsqueda y categoría
  const filteredCategories = useMemo(() => {
    if (!searchQuery && activeCategory === 'all') {
      return faqContent.categories;
    }

    const query = searchQuery.toLowerCase();
    
    return faqContent.categories
      .map((category: any) => ({
        ...category,
        questions: category.questions.filter((q: any) => 
          q.question.toLowerCase().includes(query) ||
          q.answer.toLowerCase().includes(query)
        )
      }))
      .filter((category: any) => 
        category.questions.length > 0 &&
        (activeCategory === 'all' || category.id === activeCategory)
      );
  }, [searchQuery, activeCategory, faqContent.categories]);

  const totalQuestions = faqContent.categories.reduce((acc: number, cat: any) => 
    acc + cat.questions.length, 0
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqContent.categories.flatMap((category: any) =>
      category.questions.map((item: any) => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer.replace(/<[^>]*>?/gm, '')
        }
      }))
    )
  };

  return (
    <section className="relative overflow-hidden bg-secondary/20">
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="absolute inset-0 z-0 opacity-50 dark:opacity-100">
        <div className="absolute inset-0 bg-secondary/50 [mask-image:radial-gradient(100%_100%_at_50%_0%,#000_20%,transparent_100%)]"></div>
      </div>

      <div className="container relative z-10 py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
            <SectionHeader 
                title={faqContent.title}
                description={faqContent.description}
            />

            {/* Buscador */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={faqContent.search_placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              {searchQuery && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {filteredCategories.reduce((acc: number, cat: any) => acc + cat.questions.length, 0)} resultados encontrados
                </p>
              )}
            </div>

            {/* Tabs por categorías */}
            <div className="mb-8">
              <div className="w-full flex flex-wrap gap-2 bg-background p-2 border shadow-sm rounded-lg">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-2 rounded-md font-semibold transition-all ${
                    activeCategory === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                >
                  Todas ({totalQuestions})
                </button>
                {faqContent.categories.map((category: any) => {
                  const IconComponent = categoryIcons[category.id];
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                        activeCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      {category.title} ({category.questions.length})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resultados */}
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">{faqContent.no_results}</p>
                <Button asChild variant="outline">
                  <a 
                    href={`https://wa.me/19567476078?text=${encodeURIComponent(faqContent.whatsapp_message || '¡Hola! Tengo una pregunta.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {faqContent.whatsapp_button}
                  </a>
                </Button>
              </div>
            ) : (
              <div className="space-y-10">
                {filteredCategories.map((category: any, catIndex: number) => {
                  const IconComponent = categoryIcons[category.id];
                  return (
                    <motion.div 
                      key={category.id} 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: catIndex * 0.1 }}
                    >
                      <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                        {IconComponent && (
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        <h3 className="text-2xl font-bold text-foreground">
                          {category.title}
                        </h3>
                        <span className="ml-auto text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                          {category.questions.length} preguntas
                        </span>
                      </div>
                      <Accordion type="single" collapsible className="w-full space-y-3">
                        {category.questions.map((item: any, index: number) => (
                          <AccordionItem 
                            key={`${category.id}-${index}`}
                            value={`${category.id}-${index}`} 
                            className="border-2 rounded-lg bg-background shadow-sm transition-all hover:shadow-md hover:border-primary/30 has-[[data-state=open]]:shadow-lg has-[[data-state=open]]:border-primary"
                          >
                            <AccordionTrigger className="text-left font-semibold text-base sm:text-lg px-6 py-5 group hover:no-underline [&[data-state=open]]:text-primary">
                              <span className="flex-1 pr-4">{item.question}</span>
                              <div className="h-9 w-9 rounded-full bg-secondary/80 flex items-center justify-center transition-all group-data-[state=open]:bg-primary shrink-0 group-hover:scale-110">
                                <ChevronRight className="h-5 w-5 text-primary transition-all duration-300 group-data-[state=open]:rotate-90 group-data-[state=open]:text-primary-foreground" />
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-base leading-relaxed text-foreground px-6 pb-5 prose prose-sm dark:prose-invert max-w-none">
                              <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* CTAs */}
            <div className="mt-16 space-y-6">
              <div className="bg-gradient-to-br from-[#25D366]/10 to-[#20BA5A]/10 border-2 border-[#25D366] rounded-xl p-8 text-center shadow-lg">
                <MessageCircle className="h-12 w-12 text-[#25D366] mx-auto mb-4" />
                <h4 className="text-2xl font-bold mb-2 text-foreground">{faqContent.whatsapp_cta}</h4>
                <p className="text-muted-foreground mb-4">Respuesta inmediata por WhatsApp</p>
                <Button asChild size="lg" className="font-bold text-lg bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-md hover:shadow-xl transition-all">
                  <a 
                    href={`https://wa.me/19567476078?text=${encodeURIComponent('¡Hola! Tengo una pregunta que no encontré en el FAQ.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {faqContent.whatsapp_button}
                  </a>
                </Button>
              </div>

              <div className="bg-background border-2 rounded-xl p-8 text-center shadow-md">
                <h4 className="text-xl font-semibold mb-2 text-foreground">{faqContent.contact_cta}</h4>
                <p className="text-muted-foreground mb-4">Te respondemos en menos de 24 horas</p>
                <Button asChild size="lg" variant="default" className="font-bold text-lg shadow-sm hover:shadow-md transition-all">
                  <Link href={`/${lang}/contact`}>
                    {faqContent.contact_button}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
