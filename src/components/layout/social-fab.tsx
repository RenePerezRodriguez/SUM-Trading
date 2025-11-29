'use client';

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Share2, Facebook, Instagram } from "lucide-react";
import { SiTiktok } from "react-icons/si";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48" {...props}>
    <path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6	C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"></path><path fill="#fff" d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6	C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3	L5,43.8C5,43.8,4.9,43.8,4.9,43.8z"></path><path fill="#cfd8dc" d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3	L4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24	c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2	c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z"></path><path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8	l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"></path><path fill="#fff" fillRule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0	s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3	c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9	c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8	c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z" clipRule="evenodd"></path>
  </svg>
);

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

export default function SocialFab({ dict }: { dict: any }) {
  const pathname = usePathname();
  const lang = pathname.split('/')[1];
  const [isOpen, setIsOpen] = useState(false);

  const isAdminRoute = pathname.startsWith(`/${lang}/admin`);
  const isAuthRoute = pathname.startsWith(`/${lang}/login`) || pathname.startsWith(`/${lang}/register`);

  if (isAdminRoute || isAuthRoute) {
    return null;
  }

  const phoneNumber = dict.contact_info.phone.number.replace(/\D/g, '');
  const message = dict.social_fab?.whatsapp_message || '¡Hola! Me gustaría recibir más información.';

  const socialLinks: SocialLink[] = [
    {
      name: 'WhatsApp',
      url: `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      icon: <WhatsAppIcon className="h-5 w-5" />,
      color: 'bg-[#25D366] hover:bg-[#20BA5A]'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/SUMTrading',
      icon: <Facebook className="h-5 w-5" />,
      color: 'bg-[#1877F2] hover:bg-[#0C63D4]'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/sum.trading/',
      icon: <Instagram className="h-5 w-5" />,
      color: 'bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F56040] hover:opacity-90'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@sum25177',
      icon: <SiTiktok className="h-5 w-5" />,
      color: 'bg-black hover:bg-gray-900'
    }
  ];

  return (
    <div className="fixed bottom-36 sm:bottom-6 left-4 sm:left-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 flex flex-col gap-3"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${social.name}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`${social.color} text-white rounded-full p-2.5 sm:p-3 shadow-lg transition-all hover:scale-110 flex items-center justify-center`}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-gray-600' : 'bg-primary'
          } text-white rounded-full p-3 sm:p-4 shadow-lg transition-all hover:scale-110`}
        aria-label="Toggle social media menu"
      >
        <Share2 className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform ${isOpen ? 'rotate-45' : ''}`} />
      </motion.button>
    </div>
  );
}
