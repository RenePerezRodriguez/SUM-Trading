
'use client';

import { Mail, Phone, MapPin, Facebook, Instagram, Clock } from 'lucide-react';
import LogisticsMap from '@/components/sections/logistics-map';

const ContactItem = ({ icon: Icon, title, value, href }: { icon: React.ElementType, title: string, value: string, href?: string }) => {
    const Component = href ? 'a' : 'p';
    return (
        <div className="flex items-start gap-4 group transition-all duration-300 hover:translate-x-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3">
                <Icon className="h-6 w-6 transition-transform duration-300" />
            </div>
            <div>
                <p className="font-semibold text-lg transition-colors duration-200 group-hover:text-primary">{title}</p>
                <Component
                    href={href}
                    target={href ? "_blank" : undefined}
                    rel={href ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground break-all transition-colors duration-200 hover:text-primary"
                >
                    {value}
                </Component>
            </div>
        </div>
    );
};

const SocialLink = ({ icon: Icon, name, href }: { icon: React.ElementType, name: string, href: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:-rotate-6"
        aria-label={name}
    >
        <Icon className="h-5 w-5" />
    </a>
);

export default function ContactInfo({ dict }: { dict: any }) {
    const info = dict?.contact_info || {
        title: 'Contact Information',
        email: { title: 'Email', address: 'info@sumtrading.us' },
        phone: { title: 'Phone', number: '+1 (956) 747-6078' },
        address: { title: 'USA Office', location: '9675 Joe G Garza Sr Rd, Brownsville, TX 78521' },
        address_mexico: { title: 'Mexico Office', location: 'Matamoros, Tamaulipas' },
        hours: { title: 'Business Hours', days: 'Mon-Fri', time: '9:00 AM - 6:00 PM CST' },
        social: { title: 'Follow Us' }
    };
    const socialLinks = [
        { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/sumenergyglobal' },
        { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/grupo_sum/' },
    ];
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold font-headline">{info.title}</h2>
            <div className="space-y-6">
                <ContactItem icon={Mail} title={info.email.title} value={info.email.address} href={`mailto:${info.email.address}`} />
                <ContactItem icon={Phone} title={info.phone.title} value={info.phone.number} href={`tel:${info.phone.number.replace(/\D/g, '')}`} />
                <ContactItem icon={MapPin} title={info.address.title} value={info.address.location} />
                <ContactItem icon={MapPin} title={info.address_mexico.title} value={info.address_mexico.location} />
                <ContactItem icon={Clock} title={info.hours.title} value={`${info.hours.days}: ${info.hours.time}`} />
            </div>
            <div className="h-64 w-full overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-lg">
                <LogisticsMap />
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-4">{info.social.title}</h3>
                <div className="flex space-x-4">
                    {socialLinks.map((social) => (
                        <SocialLink key={social.name} {...social} />
                    ))}
                </div>
            </div>
        </div>
    );
}
