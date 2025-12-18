'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShieldCheck, FileCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { Car } from '@/lib/placeholder-data';

interface Carousel3DProps {
    cars: Car[];
    lang: string;
    dict: any;
}

export default function Carousel3D({ cars, lang, dict }: Carousel3DProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-rotate every 4 seconds
    useEffect(() => {
        if (!isAutoPlaying || cars.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % cars.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, cars.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        // Resume auto-play after 10 seconds of inactivity
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + cars.length) % cars.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % cars.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    if (cars.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No hay vehículos destacados disponibles.</p>
            </div>
        );
    }

    // Calculate positions for 3D effect
    const getCardStyle = (index: number) => {
        const diff = index - currentIndex;
        const normalizedDiff = ((diff % cars.length) + cars.length) % cars.length;
        const adjustedDiff = normalizedDiff > cars.length / 2 ? normalizedDiff - cars.length : normalizedDiff;

        const isCenter = adjustedDiff === 0;
        const isLeft = adjustedDiff === -1 || (adjustedDiff === cars.length - 1 && cars.length > 2);
        const isRight = adjustedDiff === 1 || (adjustedDiff === -(cars.length - 1) && cars.length > 2);

        if (isCenter) {
            return {
                transform: 'translateX(0) scale(1) rotateY(0deg)',
                zIndex: 30,
                opacity: 1,
                filter: 'brightness(1)',
            };
        } else if (isLeft) {
            return {
                transform: 'translateX(-70%) scale(0.85) rotateY(15deg)',
                zIndex: 20,
                opacity: 0.7,
                filter: 'brightness(0.8)',
            };
        } else if (isRight) {
            return {
                transform: 'translateX(70%) scale(0.85) rotateY(-15deg)',
                zIndex: 20,
                opacity: 0.7,
                filter: 'brightness(0.8)',
            };
        } else {
            return {
                transform: 'translateX(0) scale(0.6)',
                zIndex: 10,
                opacity: 0,
                filter: 'brightness(0.6)',
            };
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* 3D Carousel Container */}
            <div
                className="relative h-[320px] sm:h-[380px] w-full"
                style={{ perspective: '1200px' }}
            >
                {cars.map((car, index) => {
                    const style = getCardStyle(index);
                    const isActive = index === currentIndex;

                    return (
                        <motion.div
                            key={car.id}
                            className="absolute left-1/2 top-0 w-[85%] sm:w-[75%] max-w-[400px] h-full cursor-pointer"
                            initial={false}
                            animate={{
                                x: '-50%',
                                ...style,
                            }}
                            transition={{
                                duration: 0.5,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            onClick={() => isActive ? null : goToSlide(index)}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <Link
                                href={isActive ? `/${lang}/cars/${car.id}` : '#'}
                                onClick={(e) => !isActive && e.preventDefault()}
                                className="block h-full"
                            >
                                <div className={`
                  h-full bg-white rounded-2xl overflow-hidden shadow-2xl
                  border border-border/60 transition-all duration-300
                  ${isActive ? 'ring-2 ring-primary/50' : ''}
                `}>
                                    {/* Image Section */}
                                    <div className="relative h-[55%] w-full bg-muted overflow-hidden">
                                        {car.images && car.images.length > 0 ? (
                                            <Image
                                                src={car.images[0].url}
                                                alt={`${car.make} ${car.model}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 85vw, 400px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
                                                <span className="text-muted-foreground">Sin imagen</span>
                                            </div>
                                        )}
                                        {car.status === 'Sold' && (
                                            <Badge className="absolute top-3 right-3 bg-destructive text-white">
                                                Vendido
                                            </Badge>
                                        )}
                                        {/* Gradient overlay at bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-4 h-[45%] flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground line-clamp-1 mb-1">
                                                {car.year} {car.make} {car.model}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {car.mileage?.toLocaleString() || '0'} km
                                            </p>

                                            {/* Trust Badges */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded border border-green-200">
                                                    <ShieldCheck className="w-3 h-3" />
                                                    <span>Verificado</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200">
                                                    <FileCheck className="w-3 h-3" />
                                                    <span>Título Limpio</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-primary">
                                                ${car.price?.toLocaleString() || '0'}
                                            </span>
                                            {isActive && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="text-sm text-primary font-medium"
                                                >
                                                    Ver detalles →
                                                </motion.span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Navigation Arrows */}
            {cars.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 rounded-full bg-white/90 hover:bg-white shadow-lg border border-border/50 transition-all hover:scale-110"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 rounded-full bg-white/90 hover:bg-white shadow-lg border border-border/50 transition-all hover:scale-110"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {cars.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {cars.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'bg-primary w-8'
                                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
