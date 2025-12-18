'use client';

import { useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import useSumConsultationStore from '@/hooks/use-sum-consultation-store';
import { Button } from '@/components/ui/button';
import { Trash2, Heart, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@/firebase';
import useAuthModalStore from '@/hooks/use-auth-modal-store';

export default function SumConsultationBar({ lang, dict }: { lang: string, dict: any }) {
    const { items, clearItems, removeItem, _hasHydrated } = useSumConsultationStore();
    const { user, isUserLoading } = useUser();
    const { openModal } = useAuthModalStore();
    const router = useRouter();
    const pathname = usePathname();
    const t = dict.sum_consultation_bar;

    const handleRequest = () => {
        if (!user) {
            openModal('login');
            return;
        }
        const itemIds = items.map(item => item.id).join(',');
        router.push(`/${lang}/checkout/sum-interest?ids=${itemIds}`);
    };

    if (
        !_hasHydrated || 
        items.length === 0 || 
        pathname.startsWith(`/${lang}/buy/`) || 
        pathname.startsWith(`/${lang}/checkout/`)
    ) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 150 }}
                animate={{ y: 0 }}
                exit={{ y: 150 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4"
            >
                <div className="bg-secondary/95 backdrop-blur-sm p-4 rounded-lg shadow-2xl border border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-4xl">
                    <div className="flex w-full items-center gap-4">
                        <p className="font-bold text-lg hidden sm:block whitespace-nowrap">{t.title}</p>
                        <div className="flex-1 flex items-center gap-2 overflow-x-auto min-w-0 pb-2 -mb-2">
                           {items.map(item => (
                                <div key={item.id} className="relative flex-shrink-0">
                                    <Image
                                        src={item.images[0]?.url || 'https://placehold.co/128x96'}
                                        alt={item.model}
                                        width={64}
                                        height={48}
                                        className="rounded-md object-cover h-12 w-16"
                                    />
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                           ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0 mt-4 sm:mt-0">
                        <Button onClick={handleRequest} className="w-full sm:w-auto" disabled={items.length === 0 || isUserLoading}>
                            {isUserLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Heart className="mr-2 h-4 w-4" />
                            )}
                            {t.cta_button} ({items.length})
                        </Button>
                        {items.length > 0 && (
                            <Button variant="ghost" size="icon" onClick={clearItems} aria-label={t.clear_all_aria}>
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
