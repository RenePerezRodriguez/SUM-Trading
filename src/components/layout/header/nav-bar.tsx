
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Building, Search, Heart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const catalogItems = (dict: any) => [
    { label: dict.navigation.sum_trading_catalog, type: "SUM", href: `/${dict.lang.substring(0, 2)}/cars`, icon: Building, disabled: false },
    { label: dict.navigation.copart_catalog, type: "Copart", href: `/${dict.lang.substring(0, 2)}/search`, icon: Search, disabled: false },
    { label: "IAAI", type: "IAAI", href: "#", icon: Search, disabled: true, soon: dict.navigation.coming_soon },
];

function CatalogMenu({ lang, dict, isTransparent }: { lang: string, dict: any, isTransparent: boolean }) {
    const pathname = usePathname();
    const mainCatalogPath = `/${lang}/search`;
    const isActive = pathname.startsWith(mainCatalogPath) || pathname.startsWith(`/${lang}/cars`);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className={cn(
                    'relative font-medium text-sm transition-colors duration-300 py-2 cursor-pointer flex items-center gap-1',
                    isTransparent ? 'text-white/90 hover:text-white' : 'text-foreground hover:text-primary',
                    isActive && (isTransparent ? 'text-white font-semibold' : 'text-primary font-semibold')
                )}>
                    {dict.navigation.catalog}
                    {isActive && (
                        <motion.div
                            className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-primary"
                            layoutId="underline"
                            initial={false}
                        />
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-screen max-w-sm" sideOffset={20}>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-bold leading-none font-headline">{dict.navigation.catalog}</h4>
                        <p className="text-sm text-muted-foreground">{dict.car_catalog.description}</p>
                    </div>
                    <div className="grid gap-2">
                        {catalogItems(dict).map((item) => {
                            const ItemIcon = item.icon;
                            const isLinkDisabled = item.disabled;
                            return (
                                <Link
                                    key={item.label}
                                    href={isLinkDisabled ? '#' : item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md p-2 -m-2",
                                        isLinkDisabled
                                            ? 'cursor-not-allowed opacity-50'
                                            : 'hover:bg-accent hover:text-accent-foreground'
                                    )}
                                    onClick={(e) => isLinkDisabled && e.preventDefault()}
                                >
                                    <ItemIcon className="h-5 w-5 text-primary" />
                                    <div className="flex-1">
                                        <span className="font-semibold">{item.label}</span>
                                        {item.soon && <span className="text-xs text-muted-foreground ml-2">{item.soon}</span>}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export function NavBar({ lang, dict, isTransparent }: { lang: string; dict: any; isTransparent: boolean }) {
    const pathname = usePathname();

    const navItems: Array<{ href: string; label: string; exact: boolean; icon?: LucideIcon }> = [
        { href: `/${lang}`, label: dict.navigation.home, exact: true },
        { href: `/${lang}/about`, label: dict.navigation.about, exact: false },
        { href: `/${lang}/how-it-works`, label: dict.navigation.how_it_works, exact: false },
        { href: `/${lang}/services`, label: dict.navigation.services, exact: false },
        { href: `/${lang}/faq`, label: dict.navigation.faq, exact: false },
    ];

    return (
        <nav className="hidden lg:flex h-full w-full items-center justify-center gap-6 text-sm">
            {navItems.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                const linkClasses = cn(
                    'relative font-medium text-sm transition-colors duration-300 py-2',
                    isTransparent ? 'text-white/90 hover:text-white' : 'text-foreground hover:text-primary',
                    isActive && (isTransparent ? 'text-white font-semibold' : 'text-primary font-semibold')
                );
                return (
                    <Link key={item.href} href={item.href} className={linkClasses}>
                        {item.icon ? (
                            <>
                                <item.icon className="w-4 h-4 inline mr-2" />
                                {item.label}
                            </>
                        ) : (
                            item.label
                        )}
                        {isActive && (
                            <motion.div
                                className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-primary"
                                layoutId="underline"
                                initial={false}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}

