'use client';

import { motion, useInView } from 'framer-motion';
import {
    Search,
    CreditCard,
    Truck,
    Ship,
    FileText,
    PackageCheck,
    ChevronRight,
    CheckCircle2,
} from 'lucide-react';
import { useRef, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import LogisticsMap from '@/components/sections/logistics-map';
import { cn } from '@/lib/utils';

const ICONS: { [key: string]: React.ElementType } = {
    Search: Search,
    CreditCard: CreditCard,
    Truck: Truck,
    Ship: Ship,
    FileText: FileText,
    PackageCheck: PackageCheck,
};

const ProcessStep = ({ step, index, totalSteps, isLast }: { step: any, index: number, totalSteps: number, isLast: boolean }) => {
    const Icon = ICONS[step.icon] || Search;
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <motion.div
                    ref={ref}
                    className="relative group cursor-pointer"
                    initial={{ opacity: 0, x: -50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                >
                    <div className="flex gap-3 sm:gap-6 md:gap-8">
                        {/* Left side - Icon and line */}
                        <div className="flex flex-col items-center">
                            {/* Icon container */}
                            <motion.div
                                className={cn(
                                    "relative z-10 flex h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-300",
                                    "bg-gradient-to-br from-primary/10 to-primary/5",
                                    "group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:scale-110"
                                )}
                                style={{ border: 'none' }}
                                whileHover={{ rotate: [0, -5, 5, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-primary transition-all duration-300 group-hover:text-primary" />
                                </motion.div>
                            </motion.div>

                            {/* Vertical line connector */}
                            {!isLast && (
                                <motion.div
                                    className="w-0.5 flex-grow mt-4 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent min-h-[80px]"
                                    initial={{ scaleY: 0, originY: 0 }}
                                    animate={isInView ? { scaleY: 1 } : {}}
                                    transition={{ duration: 0.8, delay: index * 0.15 + 0.4 }}
                                />
                            )}
                        </div>

                        {/* Right side - Content */}
                        <div className="flex-1 pb-8 sm:pb-12 min-w-0">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                            >
                                {/* Step label with badge */}
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        {step.step_label}
                                    </span>
                                    <motion.div
                                        className="h-px flex-grow bg-gradient-to-r from-primary/20 to-transparent"
                                        initial={{ scaleX: 0, originX: 0 }}
                                        animate={isInView ? { scaleX: 1 } : {}}
                                        transition={{ duration: 0.8, delay: index * 0.15 + 0.5 }}
                                    />
                                </div>

                                {/* Title and description card */}
                                <motion.div
                                    className={cn(
                                        "p-4 sm:p-6 rounded-xl border-2 transition-all duration-300",
                                        "bg-background border-border",
                                        "group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/5"
                                    )}
                                    whileHover={{ y: -4 }}
                                >
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-headline mb-2 sm:mb-3 transition-colors duration-300 group-hover:text-primary flex items-center gap-2">
                                        {step.title}
                                        <ChevronRight className="h-5 w-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">
                                        {step.description}
                                    </p>

                                    {/* Click to learn more hint */}
                                    <div className="mt-4 flex items-center gap-2 text-sm text-primary/70 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span>Click to learn more</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-background border-primary/20">
                <DialogHeader>
                    <DialogTitle className="font-headline text-3xl text-primary flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon className="h-6 w-6 text-primary" />
                        </div>
                        {step.modal_title}
                    </DialogTitle>
                </DialogHeader>
                <div className="pt-6 text-muted-foreground text-base leading-relaxed prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: step.modal_description }} />
                {step.icon === 'Truck' && (
                    <div className="mt-6">
                        <LogisticsMap />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default function ProcessTimeline({ dict }: { dict: any }) {
    const headerRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 });

    return (
        <div className="max-w-5xl mx-auto">
            {/* Enhanced header section */}
            <motion.div
                ref={headerRef}
                className="text-center mb-16 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary mb-6">
                    <PackageCheck className="h-4 w-4" />
                    <span>Simple & Transparent</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
                    A Clear Path to <span className="text-primary">Your Vehicle</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                    Follow our proven 5-step process from auction to delivery
                </p>
            </motion.div>

            {/* Timeline steps */}
            <div className="relative">
                {dict.steps.map((step: any, index: number) => (
                    <ProcessStep
                        key={index}
                        step={step}
                        index={index}
                        totalSteps={dict.steps.length}
                        isLast={index === dict.steps.length - 1}
                    />
                ))}
            </div>

            {/* Summary stats at the bottom */}
            <motion.div
                className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="text-center p-6 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="text-4xl font-bold text-primary mb-2">4-8</div>
                    <div className="text-sm text-muted-foreground">Weeks Average</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="text-4xl font-bold text-primary mb-2">100%</div>
                    <div className="text-sm text-muted-foreground">Transparent Process</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Support Available</div>
                </div>
            </motion.div>
        </div>
    );
}