'use client';

import SectionHeader from "@/components/sections/section-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Handshake, ShieldCheck, ClipboardCheck, Users, Lightbulb, Goal } from "lucide-react";
import { motion } from "framer-motion";

const ICONS: { [key: string]: React.ElementType } = {
    Handshake: Handshake,
    ShieldCheck: ShieldCheck,
    ClipboardCheck: ClipboardCheck,
    Users: Users,
    Lightbulb: Lightbulb,
    Goal: Goal
};

const ValueCard = ({ value, index }: { value: any, index: number }) => {
    const Icon = ICONS[value.icon] || Lightbulb;
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group bg-background">
                <CardHeader className="text-center p-8">
                    <motion.div 
                        className="flex justify-center mb-6"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                            <Icon className="w-8 h-8 text-primary" />
                        </div>
                    </motion.div>
                    <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors duration-300">
                        {value.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                        {value.description}
                    </CardDescription>
                </CardHeader>
            </Card>
        </motion.div>
    )
}

export default function OurValues({ dict }: { dict: any }) {
    return (
        <section className="py-16 sm:py-24 bg-secondary/10">
            <div className="container">
                <SectionHeader
                    title={dict.values_title}
                    description={dict.values_description}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {dict.values.map((value: any, index: number) => (
                        <ValueCard key={value.title} value={value} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}