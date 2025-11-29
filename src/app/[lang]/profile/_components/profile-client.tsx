
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { Locale } from '@/lib/i18n-config';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import useAuthModalStore from '@/hooks/use-auth-modal-store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { User, Star, CreditCard, Settings, ArrowRight, Mail, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';


function ProfileSkeleton() {
    return (
        <div className="container py-12 pt-44">
            <div className="text-center mb-12">
                <Skeleton className="h-10 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
            </div>
            <div className="mb-8">
                <Skeleton className="h-40 w-full max-w-4xl mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-48 w-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}

const InfoCard = ({ icon: Icon, title, description, cta, href, lang, disabled = false, index }: { icon: React.ElementType, title: string, description: string, cta: string, href: string, lang: string, disabled?: boolean, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <Card className="flex flex-col h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group bg-background">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <motion.div 
                        className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 5 }}
                    >
                        <Icon className="h-7 w-7" />
                    </motion.div>
                    <div>
                        <CardTitle className="font-headline text-lg group-hover:text-primary transition-colors">{title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow pt-0">
                    <CardDescription className="flex-grow text-sm leading-relaxed">{description}</CardDescription>
                    <Button asChild className="mt-6 w-full group-hover:scale-105 transition-transform" disabled={disabled}>
                        <Link href={href}>
                            {cta}
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default function ProfileClient({ dict, lang }: { dict: any, lang: Locale }) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const { openModal } = useAuthModalStore();

    useEffect(() => {
        if (!isUserLoading && !user) {
            openModal('login');
            router.replace(`/${lang}`);
        }
    }, [isUserLoading, user, openModal, router, lang]);

    if (isUserLoading || !user) {
        return <ProfileSkeleton />;
    }

    const content = dict.profile_page;
    const welcomeMessage = user.displayName ? content.welcome.replace('{name}', user.displayName.split(' ')[0]) : content.welcome_guest;

    const cards = [
        {
            key: 'personal_info',
            icon: User,
            href: `/${lang}/profile/edit`,
            disabled: false,
        },
        {
            key: 'my_garage',
            icon: Star,
            href: `/${lang}/garage`,
            disabled: false,
        },
        {
            key: 'purchase_history',
            icon: CreditCard,
            href: `/${lang}/purchases`,
            disabled: false,
        },
        {
            key: 'account_settings',
            icon: Settings,
            href: `/${lang}/profile/settings`,
            disabled: false,
        }
    ];

    // Format date
    const joinDate = user.metadata?.creationTime 
        ? new Date(user.metadata.creationTime).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        : null;

    return (
        <div className="container py-12 pt-44">
            {/* Enhanced Header */}
            <div className="text-center mb-12 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary mb-6">
                    <User className="h-4 w-4" />
                    <span>{content.badge || 'My Account'}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter font-headline mb-4">
                    {content.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {welcomeMessage}
                </p>
            </div>

            {/* User Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto mb-12"
            >
                <Card className="border-2 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-primary/20">
                                    <User className="h-12 w-12" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-500 border-4 border-background flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                            </div>

                            {/* User Details */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl font-bold mb-2">
                                    {user.displayName || 'Usuario'}
                                </h2>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-4">
                                    {user.email && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            <span className="text-sm">{user.email}</span>
                                        </div>
                                    )}
                                    {joinDate && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span className="text-sm">{lang === 'es' ? 'Miembro desde' : 'Member since'} {joinDate}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <Badge variant="secondary" className="px-3 py-1">
                                        {user.emailVerified ? '✓ Verificado' : 'No verificado'}
                                    </Badge>
                                    <Badge variant="outline" className="px-3 py-1">
                                        {lang === 'es' ? 'Cliente' : 'Customer'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
            
            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
               {cards.map((cardInfo, index) => {
                   const cardContent = content.cards[cardInfo.key as keyof typeof content.cards];
                   return (
                       <InfoCard 
                           key={cardInfo.key}
                           icon={cardInfo.icon}
                           title={cardContent.title}
                           description={cardContent.description}
                           cta={cardContent.cta}
                           href={cardInfo.href}
                           lang={lang}
                           disabled={cardInfo.disabled}
                           index={index}
                       />
                   )
               })}
            </div>
        </div>
    );
}
