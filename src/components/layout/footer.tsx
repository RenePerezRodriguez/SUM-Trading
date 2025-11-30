'use client';

import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n-config';
import FooterInfo from './footer/footer-info';
import FooterLinkColumn from './footer/footer-link-column';
import FooterCopyright from './footer/footer-copyright';

export default function Footer({ lang, dict }: { lang: Locale, dict: any }) {
  const pathname = usePathname();

  // Do not render if dictionary is not available.
  if (!dict || pathname.startsWith(`/${lang}/admin`)) {
    return null;
  }

  const footer = dict?.footer || {};
  const navigation = dict?.navigation || {};

  const navLinks = [
    { href: `/${lang}`, label: navigation?.home },
    { href: `/${lang}/search`, label: navigation?.catalog },
    { href: `/${lang}/services`, label: navigation?.services },
    { href: `/${lang}/about`, label: navigation?.about },
    { href: `/${lang}/faq`, label: navigation?.faq },
  ];

  const legalLinks = [
    { href: `/${lang}/terms`, label: footer?.terms },
    { href: `/${lang}/privacy`, label: footer?.privacy },
    { href: `/${lang}/cookies`, label: navigation?.cookies },
    { href: `/${lang}/coordinacion-arrastres`, label: footer?.coordinacion_arrastres },
    { href: `/${lang}/sitemap`, label: navigation?.sitemap },
  ];

  const contactLinks = [
    { href: `/${lang}/contact`, label: navigation?.contact },
    { href: 'tel:+19567476078', label: '+1 (956) 747-6078' },
    { href: 'mailto:info@sumtrading.us', label: 'info@sumtrading.us' },
  ];

  return (
    <footer className="bg-muted border-t border-border">
      <div className="container py-12 md:py-16 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <FooterInfo lang={lang} aboutText={footer?.about} />
          <FooterLinkColumn title={footer?.navigation} links={navLinks} />
          <FooterLinkColumn title={footer?.legal} links={legalLinks} />
          <FooterLinkColumn title={footer?.contact} links={contactLinks} showSocial />
        </div>
        <FooterCopyright
          rightsText={footer?.rights}
          creditsPrefix={footer?.credits_prefix}
        />
      </div>
    </footer>
  );
}
