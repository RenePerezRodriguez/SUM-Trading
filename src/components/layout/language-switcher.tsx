'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { i18n, Locale } from '@/lib/i18n-config';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Search, Car, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const FlagMexico = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 7" className="w-5 h-auto rounded-sm">
    <path fill="#006847" d="M0 0h4v7H0z" />
    <path fill="#fff" d="M4 0h4v7H4z" />
    <path fill="#ce1126" d="M8 0h4v7H8z" />
  </svg>
);

const FlagUSA = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7410 3900" className="w-5 h-auto rounded-sm">
    <path fill="#b22234" d="M0 0h7410v3900H0z" />
    <path fill="#fff" d="M0 300h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0z" />
    <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
  </svg>
);

const FlagIcon = ({ code }: { code: string }) => {
  switch (code) {
    case 'es':
      return <FlagMexico />;
    case 'en':
      return <FlagUSA />;
    default:
      return null;
  }
}

export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();

  if (pathname.startsWith(`/${lang}/admin`)) {
    return null;
  }

  return null; // FAB completamente removido
}
