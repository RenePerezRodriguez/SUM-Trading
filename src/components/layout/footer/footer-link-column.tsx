
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

type FooterLink = {
  href: string;
  label: string;
};

type FooterLinkColumnProps = {
  title: string;
  links: FooterLink[];
  showSocial?: boolean;
};

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/sumenergyglobal' },
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/grupo_sum/' },
  { name: 'TikTok', icon: TikTokIcon, href: 'https://www.tiktok.com/@sum25177' },
];

export default function FooterLinkColumn({ title, links, showSocial = false }: FooterLinkColumnProps) {
  return (
    <div>
      <h3 className="font-headline font-semibold mb-4 text-foreground">{title}</h3>
      <ul className="space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors inline-block">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      
      {showSocial && (
        <div className="flex space-x-3 mt-6">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
            >
              <social.icon className="h-5 w-5" />
              <span className="sr-only">{social.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
