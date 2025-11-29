
'use client';

import { testimonials, Testimonial as TestimonialType } from '@/lib/placeholder-data';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, StarHalf } from 'lucide-react';
import SectionHeader from './section-header';

const TestimonialCard = ({ testimonial, index }: { testimonial: TestimonialType, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
        <Card className="h-full bg-secondary/30 border-secondary/50">
            <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="relative w-20 h-20 mb-4">
                    <Image
                        src={testimonial.avatar.url}
                        alt={`Avatar of ${testimonial.name}`}
                        fill
                        className="rounded-full object-cover shadow-lg"
                        data-ai-hint={testimonial.avatar.hint}
                    />
                </div>
                <h3 className="font-bold text-lg">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{testimonial.location}</p>
                <div className="flex text-primary mb-4">
                    {[...Array(4)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                    <StarHalf className="w-5 h-5 fill-current" />
                </div>
                <p className="font-headline text-lg mb-2 text-foreground">"{testimonial.title}"</p>
                <p className="text-muted-foreground text-sm">"{testimonial.comment}"</p>
            </CardContent>
        </Card>
        </motion.div>
    );
};

export default function TestimonialsSection({ dict }: { dict: any }) {
    const content = dict.testimonials;
  return (
    <section>
      <div className="container">
        <SectionHeader 
            title={content.title}
            description={content.description}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
