
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';

type SitemapLink = {
  href: string;
  label: string;
};

const SitemapColumn = ({ title, links }: { title: string; links: SitemapLink[] }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-3">
            {links.map((page) => (
                <li key={page.href}>
                <Link href={page.href} className="text-primary hover:underline">
                    {page.label}
                </Link>
                </li>
            ))}
            </ul>
        </CardContent>
    </Card>
);


export default async function SitemapPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = dict.sitemap_page;
  const nav = dict.navigation;
  const legal = dict.footer;

  const mainPages = [
    { href: `/${lang}`, label: nav.home },
    { href: `/${lang}/cars`, label: nav.catalog },
    { href: `/${lang}/about`, label: nav.about },
    { href: `/${lang}/how-it-works`, label: nav.how_it_works },
    { href: `/${lang}/contact`, label: nav.contact },
  ];

  const legalPages = [
    { href: `/${lang}/terms`, label: legal.terms },
    { href: `/${lang}/privacy`, label: legal.privacy },
    { href: `/${lang}/cookies`, label: nav.cookies },
    { href: `/${lang}/sitemap`, label: nav.sitemap },
  ];

  return (
    <div className="container py-8 md:py-12 pt-28 md:pt-44">
        <PageHeader title={content.title} description={content.description} />

        <div className="max-w-md mx-auto grid grid-cols-1 gap-8">
            <SitemapColumn title={content.main_pages} links={mainPages} />
            <SitemapColumn title={content.legal_pages} links={legalPages} />
        </div>
    </div>
  );
}
