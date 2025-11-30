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

            {/* Video Section - Phone Mockup */}
            <motion.div 
                className="relative w-full max-w-[320px] mx-auto"
                initial={{ opacity: 0, y: 40, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            >
                {/* Phone Bezel */}
                <div className="relative rounded-[3rem] border-[8px] border-gray-900 bg-gray-900 shadow-2xl overflow-hidden">
                    {/* Screen */}
                    <div className="relative rounded-[2.5rem] overflow-hidden bg-black aspect-[9/19]">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-gray-900 rounded-b-2xl z-20"></div>
                        
                        {/* Video Content */}
                        <iframe
                            src="https://www.instagram.com/reel/DO9yvWVkeAc/embed"
                            className="w-full h-full border-0 object-cover scale-[1.02]" // Scale slightly to hide edges
                            allowFullScreen
                            scrolling="no"
                            allow="encrypted-media"
                        />
                    </div>

                    {/* Side Buttons (Decorative) */}
                    <div className="absolute top-24 -right-3 h-16 w-1.5 bg-gray-800 rounded-r-md shadow-sm"></div>
                    <div className="absolute top-24 -left-3 h-10 w-1.5 bg-gray-800 rounded-l-md shadow-sm"></div>
                    <div className="absolute top-40 -left-3 h-16 w-1.5 bg-gray-800 rounded-l-md shadow-sm"></div>
                </div>
                
                {/* Shadow/Reflection effect */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/30 blur-2xl rounded-full"></div>
            </motion.div>
        </div>
    );
}