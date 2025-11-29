'use client';

import Link from 'next/link';
import type { Locale } from '@/lib/i18n-config';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, useScroll, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { MobileMenu } from './header/mobile-menu';
import { Logo } from './logo';
import { UserNav } from './header/user-nav';
import { i18n } from '@/lib/i18n-config';
import { NavBar } from './header/nav-bar';
import { HeaderSearch } from './header/header-search';
import { Button } from '../ui/button';
import { Mail, Phone, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

const FlagSpain = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" className="w-5 h-auto rounded-sm">
    <rect width="750" height="500" fill="#c60b1e"/>
    <rect width="750" height="250" y="125" fill="#ffc400"/>
  </svg>
);

const FlagUSA = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7410 3900" className="w-4 h-auto rounded-sm">
    <path fill="#b22234" d="M0 0h7410v3900H0z"/>
    <path fill="#fff" d="M0 300h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0z"/>
    <path fill="#3c3b6e" d="M0 0h2964v2100H0z"/>
  </svg>
);

const FlagIcon = ({ code }: { code: string }) => {
  switch (code) {
    case 'es':
      return <FlagSpain />;
    case 'en':
      return <FlagUSA />;
    default:
      return null;
  }
};


export default function Header({ lang, dict }: { lang: Locale; dict: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  
  if (pathname.startsWith(`/${lang}/admin`)) {
    return null;
  }
  
  const isHomePage = pathname === `/${lang}` || pathname === `/${i18n.defaultLocale}`;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isNowScrolled = currentScrollY > 50;
      const shouldCompact = currentScrollY > 100;
      setIsScrolled(isNowScrolled);
      setIsCompact(shouldCompact);
      lastScrollY.current = currentScrollY;
    };
    
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHomePage && !isScrolled;

  const headerClasses = cn(
    'fixed top-0 z-50 w-full transition-all duration-300',
    isTransparent ? 'bg-transparent' : 'bg-background/80 backdrop-blur-sm shadow-md'
  );
  
  const iconColorClass = cn(
      'transition-colors',
      isTransparent 
      ? 'text-white/90 hover:text-white'
      : 'text-foreground hover:text-primary'
  );

  return (
    <>
      <motion.header
        className={headerClasses}
        initial={{ y: 0 }}
        animate={{ height: isCompact ? 'auto' : 'auto' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Row 1: Main Navigation */}
        <motion.div 
          className="container"
          animate={{ 
            paddingTop: isCompact ? '0.5rem' : '0.75rem',
            paddingBottom: isCompact ? '0.5rem' : '0.75rem'
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-2 lg:gap-6">
              <MobileMenu lang={lang} dict={dict} iconColorClass={iconColorClass} />
              <Link
                href={`/${lang}`}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <motion.div
                  whileHover={{ rotate: [0, -15, 15, -15, 15, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  animate={{ scale: isCompact ? 0.9 : 1 }}
                >
                  <Logo className={cn("transition-all", isCompact ? "h-7 w-7" : "h-8 w-8")} />
                </motion.div>
                <motion.span
                  className={cn(
                    'font-bold font-headline hidden sm:inline transition-all',
                    iconColorClass
                  )}
                  animate={{ fontSize: isCompact ? '1.125rem' : '1.25rem' }}
                >
                  SUM Trading
                </motion.span>
              </Link>
              <NavBar lang={lang} dict={dict} isTransparent={isTransparent} />
            </div>

            {/* Right: Partners + User */}
            <div className="flex items-center gap-3">
              {/* Partners */}
              <motion.div 
                className="hidden lg:flex items-center gap-3"
                animate={{ opacity: isCompact ? 0 : 1, scale: isCompact ? 0.8 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {!isCompact && partners.map((partner) => (
                  <Link
                    key={partner.name}
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center transition-opacity hover:opacity-80"
                    title={partner.name}
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      height={18}
                      width={55}
                      className={cn(
                        'object-contain',
                        isTransparent && partner.name !== 'Copart' && 'brightness-0 invert'
                      )}
                      style={{ height: '18px', width: 'auto' }}
                    />
                  </Link>
                ))}
              </motion.div>

              {/* Contact Icons */}
              <motion.div 
                className="hidden md:flex items-center gap-2"
                animate={{ opacity: isCompact ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {!isCompact && (
                  <>
                    <a
                      href={`mailto:${dict.contact_info.email.address}`}
                      className={cn(
                        "flex items-center gap-1.5 text-xs transition-colors",
                        isTransparent ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-primary"
                      )}
                      title={dict.contact_info.email.address}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    <a
                      href={`tel:${dict.contact_info.phone.number.replace(/\\\\D/g, '')}`}
                      className={cn(
                        "flex items-center gap-1.5 text-xs transition-colors",
                        isTransparent ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-primary"
                      )}
                      title={dict.contact_info.phone.number}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </>
                )}
              </motion.div>

              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-9 px-3 gap-2 font-medium transition-all",
                      isTransparent
                        ? "text-white hover:bg-white/10 hover:text-white"
                        : "text-foreground hover:bg-accent"
                    )}
                  >
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">{lang === 'es' ? 'Español' : 'USA'}</span>
                    <span className="sm:hidden">{lang.toUpperCase()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {i18n.locales.map((locale) => {
                    const segments = pathname.split('/');
                    segments[1] = locale;
                    const href = segments.join('/');
                    const displayName = locale === 'es' ? 'Español' : 'USA';
                    return (
                      <DropdownMenuItem key={locale} asChild>
                        <Link
                          href={href}
                          className={cn(
                            'flex items-center gap-2 w-full',
                            lang === locale && 'font-bold bg-accent'
                          )}
                        >
                          <FlagIcon code={locale} />
                          {displayName}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <UserNav dict={dict} lang={lang} isTransparent={isTransparent} />
            </div>
          </div>
        </motion.div>

        {/* Row 2: Search + Actions (Se oculta al hacer scroll) */}
        <motion.div
          className={cn(
            "border-t",
            isTransparent ? "border-white/10" : "border-border"
          )}
          animate={{ 
            height: isCompact ? 0 : 'auto',
            opacity: isCompact ? 0 : 1,
            paddingTop: isCompact ? 0 : '0.875rem',
            paddingBottom: isCompact ? 0 : '0.875rem',
          }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          {!isCompact && (
            <div className="container">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <HeaderSearch dict={dict} lang={lang} isTransparent={isTransparent} className="flex-1 max-w-full md:max-w-md" />
                <div className="flex items-center gap-2">
                  <Button asChild size="default" variant="ghost" className={cn(
                    "flex-1 md:flex-none",
                    isTransparent ? "text-white/90 hover:bg-white/10 hover:text-white" : ""
                  )}>
                    <Link href={`/${lang}/search`}>
                      {dict.navigation.catalog}
                    </Link>
                  </Button>
                  <Button asChild size="default" className={cn(
                    'font-medium flex-1 md:flex-none',
                    isTransparent 
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/30' 
                    : 'bg-accent hover:bg-accent/90 text-white'
                  )}>
                    <Link href={`/${lang}/contact`}>
                      {dict.navigation.contact}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Progress Bar */}
        <motion.div className="h-0.5 bg-primary" style={{ scaleX }} />
      </motion.header>
    </>
  );
}
