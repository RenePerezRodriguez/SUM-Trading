
'use client';
import { Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

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

export function TopBar({ dict, isTransparent }: { dict: any; isTransparent: boolean }) {
  const info = dict.contact_info;
  const partnersContent = dict.partners;
  
  return (
    <div className={cn(
      "py-2 text-xs hidden md:block transition-colors duration-300 border-b",
      isTransparent ? "bg-transparent border-white/10" : "bg-background/95 border-border"
    )}>
      <div className="container flex justify-between items-center gap-4">
        <div className="flex items-center gap-x-4">
            <h2 className={cn(
                "text-xs font-semibold uppercase tracking-wider",
                isTransparent ? "text-white/80" : "text-foreground/90"
            )}>
                {partnersContent.title}
            </h2>
            <div className="flex items-center gap-x-4">
                {partners.map((partner) => (
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
                          height={20}
                          width={65}
                          className={cn(
                            'object-contain',
                            isTransparent && partner.name !== 'Copart' && 'brightness-0 invert'
                          )}
                          style={{ height: '20px', width: 'auto' }}
                      />
                    </Link>
                ))}
            </div>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <a
            href={`mailto:${info.email.address}`}
            className={cn("flex items-center gap-1.5 transition-colors", isTransparent ? "text-white/80 hover:text-white" : "text-foreground hover:text-primary")}
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">{info.email.address}</span>
          </a>
          <a
            href={`tel:${info.phone.number.replace(/\\D/g, '')}`}
            className={cn("hidden sm:flex items-center gap-1.5 transition-colors", isTransparent ? "text-white/80 hover:text-white" : "text-foreground hover:text-primary")}
          >
            <Phone className="w-4 h-4" />
            <span>{info.phone.number}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
