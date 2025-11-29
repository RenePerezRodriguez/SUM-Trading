
'use client';

import { useUser, useAuth, useFirestore, useMemoFirebase } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { LogOut, Home } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/layout/logo';
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/user-profile';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';


function AdminHeader({ dict }: { dict: any }) {
    const auth = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const lang = pathname.split('/')[1] || 'es';
    const t = dict.admin_header;

    const handleLogout = async () => {
        if (!auth) return;
        try {
          // First, delete the session cookie on the server
          await fetch('/api/auth/session', { method: 'DELETE' });
          // Then, sign out the user from the client
          await signOut(auth);

          toast({
            title: t.logout_success_title,
            description: t.logout_success_desc,
          });
          router.push(`/${lang}`);
          router.refresh();
        } catch (error) {
          console.error("Error signing out: ", error);
          toast({
            variant: "destructive",
            title: t.logout_error_title,
            description: t.logout_error_desc,
          });
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-50">
            <div className="container flex items-center justify-between h-full">
                <div className="flex items-center gap-3 text-lg font-bold font-headline">
                    <Logo className="h-7 w-7 text-primary" />
                    <h1>SUM Trading - Admin</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline">
                        <Link href={`/${lang}`}>
                            <Home className="mr-2 h-4 w-4" />
                            {t.go_to_home}
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t.logout}
                    </Button>
                </div>
            </div>
        </header>
    );
}

function AccessDenied({ lang, dict }: { lang: string, dict: any }) {
    const router = useRouter();
    const t = dict.admin_layout;
    return (
        <div className="container py-12 pt-32 text-center">
            <PageHeader 
                title={t.access_denied_title}
                description={t.access_denied_desc}
            />
            <Button onClick={() => router.push(`/${lang}`)}>{t.back_to_home}</Button>
        </div>
    )
}

function LoadingScreen() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="w-full max-w-md space-y-4 p-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-12 w-full mt-6" />
            </div>
        </div>
    );
}


export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const lang = (pathname.split('/')[1] || 'es') as Locale;
    const [dict, setDict] = useState<any>(null);

    useEffect(() => {
        getDictionary(lang).then(setDict);
    }, [lang]);
    
    const createSession = useCallback(async (user: any) => {
        try {
            const idToken = await user.getIdToken(true);
            const response = await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });
            return response.ok;
        } catch (error) {
            console.error('Failed to create session cookie:', error);
            return false;
        }
    }, []);

    useEffect(() => {
        const isPublicAdminPage = pathname.includes('/admin/login') || pathname.includes('/admin/register');

        if (isUserLoading) {
            setIsAuthorized(null);
            return;
        }

        if (!user) {
            if (!isPublicAdminPage) {
                router.replace(`/${lang}/admin/login`);
            } else {
                setIsAuthorized(true);
            }
            return;
        }
        
        const verifyAdminStatus = async () => {
            if (!firestore) {
                setIsAuthorized(false);
                return;
            }
            try {
                const userDocRef = doc(firestore, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                const isAdmin = userDoc.exists() && (userDoc.data() as UserProfile).role === 'admin';
                
                if (isAdmin) {
                    const sessionCreated = await createSession(user);
                    if (sessionCreated) {
                        setIsAuthorized(true);
                        if (isPublicAdminPage) {
                            router.replace(`/${lang}/admin`);
                        }
                    } else {
                        // Failed to create session, treat as unauthorized
                        setIsAuthorized(false);
                    }
                } else {
                    setIsAuthorized(false);
                }

            } catch (error) {
                console.error("Error verifying admin status:", error);
                setIsAuthorized(false);
            }
        };
        
        verifyAdminStatus();

    }, [user, isUserLoading, pathname, router, lang, firestore, createSession]);

    if (!dict || (isAuthorized === null && !pathname.includes('/admin/login') && !pathname.includes('/admin/register'))) {
        return <LoadingScreen />;
    }

    const isPublicAdminPage = pathname.includes('/admin/login') || pathname.includes('/admin/register');
    
    if (isAuthorized === false && !isPublicAdminPage) {
        return <AccessDenied lang={lang} dict={dict} />;
    }
    
    // Render admin layout for verified admins or for public admin pages
    if (isAuthorized) {
        return (
            <>
                {!isPublicAdminPage && <AdminHeader dict={dict} />}
                <main className={!isPublicAdminPage ? 'pt-16' : ''}>
                    {children}
                </main>
            </>
        );
    }
    
    // Fallback loading screen
    return <LoadingScreen />;
}
