
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function HeaderSearch({ dict, lang, isTransparent, className }: { dict: any; lang: string; isTransparent: boolean, className?: string }) {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/${lang}/search?query=${encodeURIComponent(searchQuery.trim())}&page=1&limit=10`);
        }
    };

    return (
        <form onSubmit={handleSearchSubmit} className={cn("relative w-full max-w-sm flex items-center", className)}>
            <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", isTransparent ? 'text-white/70' : 'text-foreground/80')} />
            <Input
                type="search"
                placeholder={dict.hero.search_placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                    "w-full h-9 pl-9 pr-20 text-xs transition-colors",
                    isTransparent ? 'bg-transparent text-white placeholder:text-white/70 border-white/20 focus:border-white/50' : 'bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20'
                )}
            />
            <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-3 text-xs" size="sm">
                {dict.hero.search_button}
            </Button>
        </form>
    );
}
