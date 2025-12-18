
import Link from 'next/link';
import type { Locale } from '@/lib/i18n-config';
import { Logo } from '../logo';

type FooterInfoProps = {
  lang: Locale;
  aboutText: string;
};

export default function FooterInfo({ lang, aboutText }: FooterInfoProps) {
  return (
    <div className="flex flex-col">
      <Link href={`/${lang}`} className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
        <Logo className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold font-headline text-foreground">SUM Trading</span>
      </Link>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{aboutText}</p>
    </div>
  );
}
