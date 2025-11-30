'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import { Menu, LogIn, Search, Star, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n-config';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Logo } from '../logo';
import { useUser } from '@/firebase';
import useAuthModalStore from '@/hooks/use-auth-modal-store';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const partners = [
  { 
    name: 'Copart', 
    logo: '/images/copart-logo.svg',
    href: 'https://www.copart.com/'
  },
  { 
    name: 'Manheim', 
    logo: 'https://mcom-header-footer.manheim.com/assets/common/OMIY_lockup.svg',
    href: 'https://site.manheim.com/en/locations.html'
  },
  { 
    name: 'IAA', 
    logo: 'https://cdn.freelogovectors.net/wp-content/uploads/2022/07/iaa-logo-freelogovectors.net_.png',
    href: 'https://www.iaai.com/'
  },
];
  
const catalogItems = (lang: Locale, dict: any) => [
    {
      title: dict.navigation.sum_trading_catalog,
      href: `/${lang}/cars`
    },
    {
      title: dict.navigation.copart_catalog,
      href: `/${lang}/search`,
    }
]

type MobileMenuProps = {
  lang: Locale;
  dict: any;
  iconColorClass: string;
};

export function MobileMenu({ lang, dict, iconColorClass }: MobileMenuProps) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const { openModal } = useAuthModalStore();
  
  const mainCatalogPath = `/${lang}/search`;
  const isCatalogActive = pathname?.startsWith(mainCatalogPath);

  const currentUrl = `${pathname}?${searchParams.toString()}`;

  const navItems = [
    { href: `/${lang}`, label: dict.navigation.home },
    { href: `/${lang}/about`, label: dict.navigation.about },
    { href: `/${lang}/how-it-works`, label: dict.navigation.how_it_works },
    { href: `/${lang}/faq`, label: dict.navigation.faq },
  ];

  const handleLoginClick = () => {
    setMobileMenuOpen(false);
    openModal('login');
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${lang}/search?query=${encodeURIComponent(searchQuery.trim())}&page=1&limit=10`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('lg:hidden transition-colors', iconColorClass)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">{dict.mobile_menu.open_menu}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader className="border-b pb-4 mb-4">
          <SheetTitle>
            <Link
              href={`/${lang}`}
              className="flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Logo className="h-7 w-7 text-primary" />
              <span className="font-bold font-headline">SUM Trading</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSearchSubmit} className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                placeholder={dict.hero.search_placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 text-base border-2 focus-visible:ring-2"
            />
        </form>

        <div className="flex-1 flex flex-col space-y-1">
            {navItems.map((item) => (
                 <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                    'text-lg transition-colors hover:text-primary font-medium py-3 px-2 rounded-md hover:bg-accent block',
                    pathname === item.href
                        ? 'text-primary bg-accent/50'
                        : 'text-foreground/80'
                    )}
                >
                    {item.label}
                </Link>
            ))}
          
          <Accordion type="single" collapsible defaultValue={isCatalogActive ? "item-1" : ""}>
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger 
                    className="py-3 px-2 hover:no-underline -ml-0 flex-1 text-left text-lg font-medium transition-colors hover:text-primary rounded-md hover:bg-accent"
                >
                    <Link
                        href={mainCatalogPath}
                        onClick={(e) => {
                            e.stopPropagation();
                            setMobileMenuOpen(false)
                        }}
                        className={cn(
                            'flex-1 text-left',
                            pathname === mainCatalogPath && !searchParams.toString() && 'text-primary'
                        )}
                        >
                        {dict.navigation.catalog}
                    </Link>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-4 flex flex-col space-y-2 pt-2">
                  {catalogItems(lang, dict).map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-muted-foreground hover:text-primary transition-colors",
                         currentUrl.endsWith(item.href) && "text-primary font-semibold"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Link
            href={`/${lang}/contact`}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
            'text-lg transition-colors hover:text-primary font-medium py-3 px-2 rounded-md hover:bg-accent block',
            pathname === `/${lang}/contact`
                ? 'text-primary bg-accent/50'
                : 'text-foreground/80'
            )}
            >
                {dict.navigation.contact}
            </Link>

        </div>

        <SheetFooter className="mt-auto border-t pt-4">
            {user ? (
                 <div className="flex flex-col gap-2">
                    <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)} className="w-full justify-start text-lg p-2 h-auto">
                        <Link href={`/${lang}/garage`}>
                            <Star className="mr-3 h-5 w-5" />
                            {dict.garage_page.title}
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)} className="w-full justify-start text-lg p-2 h-auto">
                        <Link href={`/${lang}/profile`}>
                            <User className="mr-3 h-5 w-5" />
                            {dict.navigation.profile}
                        </Link>
                    </Button>
                 </div>
            ) : (
                <div className="flex flex-col gap-2">
                     <Button variant="ghost" onClick={handleLoginClick} className="w-full justify-start text-lg p-2 h-auto">
                        <LogIn className="mr-3 h-5 w-5" />
                        {dict.navigation.login}
                    </Button>
                    <Button asChild onClick={() => setMobileMenuOpen(false)} className="w-full text-lg p-2 h-auto">
                         <Link href={`/${lang}/register`}>{dict.navigation.register}</Link>
                    </Button>
                </div>
            )}
            
            <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-3 font-medium">Broker Certificado:</p>
                <div className="flex items-center gap-4 opacity-80 grayscale hover:grayscale-0 transition-all">
                    {partners.map(p => (
                        <Image 
                          key={p.name} 
                          src={p.logo} 
                          alt={p.name} 
                          width={60} 
                          height={20} 
                          className="h-5 w-auto object-contain"
                        />
                    ))}
                </div>
            </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
