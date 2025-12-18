'use client';

import { useUser, useAuth, useFirestore } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { LogOut, Home, ShieldX } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/layout/logo';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/user-profile';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { AdminTour } from '@/components/admin/admin-tour';

function AdminHeader({ dict }: { dict: any }) {
    const auth = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const lang = pathname.split('/')[1] || 'es';
    const t = dict?.admin_header || {};

    const handleLogout = async () => {
        if (!auth) return;
        try {
            await fetch('/api/auth/session', { method: 'DELETE' });
            await signOut(auth);
            toast({
                title: t.logout_success_title || "Sesión cerrada",
                description: t.logout_success_desc || "Has cerrado sesión correctamente",
            });
            router.push(`/${lang}`);
            router.refresh();
        } catch (error) {
            console.error("Error signing out: ", error);
            toast({
                variant: "destructive",
                title: t.logout_error_title || "Error",
                description: t.logout_error_desc || "No se pudo cerrar sesión",
            });
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-background border-b z-50 print:hidden">
            <div className="container flex items-center justify-between h-full px-3 sm:px-4">
                <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-bold font-headline">
                    <Logo className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                    <h1 className="hidden sm:block">SUM Trading - Admin</h1>
                    <h1 className="sm:hidden">Admin</h1>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <AdminTour />
                    <Button asChild variant="outline" size="sm" className="h-9 px-2 sm:px-3">
                        <Link href={`/${lang}`}>
                            <Home className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">{t.go_to_home || "Inicio"}</span>
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="h-9 px-2 sm:px-3">
                        <LogOut className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">{t.logout || "Salir"}</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}

function AccessDenied({ lang }: { lang: string }) {
    const router = useRouter();
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center max-w-md p-8">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                    <ShieldX className="h-8 w-8 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Acceso Denegado</h1>
                <p className="text-muted-foreground mb-6">
                    No tienes permisos de administrador para acceder a esta sección.
                </p>
                <Button onClick={() => router.push(`/${lang}`)}>
                    Volver al Inicio
                </Button>
            </div>
        </div>
    );
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
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const lang = (pathname.split('/')[1] || 'es') as Locale;
    const [dict, setDict] = useState<any>(null);

    // Public pages that don't require auth
    const isPublicAdminPage = pathname.includes('/admin/login') || pathname.includes('/admin/register');

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
        const checkAuth = async () => {
            // Still loading user - wait
            if (isUserLoading) {
                return;
            }

            // No user logged in
            if (!user) {
                if (!isPublicAdminPage) {
                    // Protected page - redirect to login
                    console.log('[AdminLayout] No user, redirecting to login');
                    router.replace(`/${lang}/admin/login`);
                } else {
                    // Public page - allow access
                    setIsAuthorized(true);
                }
                setIsChecking(false);
                return;
            }

            // User is logged in - check if admin
            if (!firestore) {
                console.log('[AdminLayout] Firestore not ready');
                setIsAuthorized(false);
                setIsChecking(false);
                return;
            }

            try {
                console.log('[AdminLayout] Checking admin status for user:', user.uid);
                const userDocRef = doc(firestore, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    console.log('[AdminLayout] User document does not exist');
                    setIsAuthorized(false);
                    setIsChecking(false);
                    return;
                }

                const userData = userDoc.data() as UserProfile;
                const isAdmin = userData.role === 'admin';
                console.log('[AdminLayout] User role:', userData.role, 'isAdmin:', isAdmin);

                if (isAdmin) {
                    const sessionCreated = await createSession(user);
                    if (sessionCreated) {
                        setIsAuthorized(true);
                        // If admin is on login page, redirect to dashboard
                        if (isPublicAdminPage) {
                            console.log('[AdminLayout] Admin on login page, redirecting to dashboard');
                            router.replace(`/${lang}/admin`);
                        }
                    } else {
                        console.log('[AdminLayout] Failed to create session');
                        setIsAuthorized(false);
                    }
                } else {
                    console.log('[AdminLayout] User is not admin');
                    setIsAuthorized(false);
                }
            } catch (error) {
                console.error('[AdminLayout] Error checking admin status:', error);
                setIsAuthorized(false);
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [user, isUserLoading, pathname, router, lang, firestore, createSession, isPublicAdminPage]);

    // Show loading while checking auth (but not for public pages without user)
    if (isChecking && (user || !isPublicAdminPage)) {
        return <LoadingScreen />;
    }

    // Show access denied for non-admin users trying to access protected pages
    if (isAuthorized === false && !isPublicAdminPage) {
        return <AccessDenied lang={lang} />;
    }

    // Authorized admin or unauthenticated user on public page - render content
    if (isAuthorized || (isPublicAdminPage && !user)) {
        return (
            <>
                {!isPublicAdminPage && dict && <AdminHeader dict={dict} />}
                <main className={!isPublicAdminPage ? 'pt-16' : ''}>
                    {children}
                </main>
            </>
        );
    }

    // Fallback loading (should rarely happen)
    return <LoadingScreen />;
}
