'use client';

import { motion } from 'framer-motion';
import { Target, Eye, Sparkles } from 'lucide-react';

export default function OurMission({ dict }: { dict: any }) {
    return (
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
            >
                {/* Mission Card */}
                <motion.div 
                    className="p-8 rounded-xl border-2 border-border bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Target className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold font-headline text-primary">
                            {dict.mission_title}
                        </h2>
                    </div>
                    <p className="text-muted-foreground md:text-lg leading-relaxed">
                        {dict.mission_text}
                    </p>
                </motion.div>

                {/* Vision Card */}
                <motion.div 
                    className="p-8 rounded-xl border-2 border-border bg-gradient-to-br from-accent/5 to-transparent hover:border-accent/50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Eye className="h-6 w-6 text-accent" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold font-headline text-accent">
                            {dict.vision_title}
                        </h2>
                    </div>
                    <p className="text-muted-foreground md:text-lg leading-relaxed">
                        {dict.vision_text}
                    </p>
                </motion.div>
            </motion.div>

            {/* Video Section */}
            <motion.div 
                className="relative w-full max-w-md mx-auto overflow-hidden rounded-xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
            >
                <div className="relative aspect-[9/16] w-full">
                    <iframe
                        src="https://www.instagram.com/reel/DO9yvWVkeAc/embed"
                        className="w-full h-full border-0"
                        allowFullScreen
                        scrolling="no"
                        allow="encrypted-media"
                    />
                </div>
            </motion.div>
        </div>
    );
}