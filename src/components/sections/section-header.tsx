
'use client';

import { motion } from 'framer-motion';

type SectionHeaderProps = {
    title: string;
    description: string;
    subtitle?: string;
};

export default function SectionHeader({ title, description, subtitle }: SectionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
        >
            {subtitle && (
                <p className="font-semibold text-accent mb-2 text-sm uppercase tracking-wider">
                    {subtitle}
                </p>
            )}
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                {title}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
                {description}
            </p>
        </motion.div>
    );
}
