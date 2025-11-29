'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils";
import { CreditCard, LifeBuoy, LogIn, LogOut, Settings, User, LayoutGrid, Star } from "lucide-react";
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import useAuthModalStore from "@/hooks/use-auth-modal-store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc } from "firebase/firestore";
import type { UserProfile } from "@/lib/user-profile";

export function UserNav({ dict, lang, isTransparent }: { dict: any, lang: string, isTransparent: boolean }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const { openModal } = useAuthModalStore();
  
  const userDocRef = useMemoFirebase(() => {
      if (!firestore || !user) return null;
      return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  const isAdmin = userProfile?.role === 'admin';

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast({
        title: dict.user_nav.logout_success_title,
        description: dict.user_nav.logout_success_desc,
      });
      router.push(`/${lang}`);
      router.refresh();
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        variant: "destructive",
        title: dict.user_nav.logout_error_title,
        description: dict.user_nav.logout_error_desc,
      });
    }
  };

  if (isUserLoading || (user && isProfileLoading)) {
    return <Skeleton className="h-9 w-24 rounded-md" />;
  }

  if (!user || user.isAnonymous) {
    return (
      <div className="hidden md:flex items-center gap-1 sm:gap-2">
         <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => openModal('login')}
            className={cn(
             'transition-colors',
             isTransparent 
             ? 'text-white/90 hover:bg-white/10 hover:text-white' 
             : 'text-foreground hover:bg-accent hover:text-primary'
          )}>
            <LogIn className="mr-2 h-4 w-4" />
            {dict.navigation.login}
          </Button>
          <Button 
            size="sm" 
            onClick={() => openModal('register')}
            className={cn(
                'transition-colors',
                isTransparent 
                ? 'bg-white/10 text-white hover:bg-white/20' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
          >
            {dict.navigation.register}
            </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9 border-2 border-primary/50">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || dict.user_nav.user_alt} />
              <AvatarFallback>{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName || dict.user_nav.user_alt}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/${lang}/profile`}>
                <User className="mr-2 h-4 w-4" />
                <span>{dict.navigation.profile}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/${lang}/garage`}>
                <Star className="mr-2 h-4 w-4" />
                <span>{dict.garage_page.title}</span>
              </Link>
            </DropdownMenuItem>
            {isAdmin && (
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/${lang}/admin`}>
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        <span>{dict.user_nav.admin_panel}</span>
                    </Link>
                </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/${lang}/purchases`}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>{dict.purchases_page.title}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/${lang}/profile/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{dict.profile_page.cards.account_settings.title}</span>
                </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
           <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={`/${lang}/contact`}>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>{dict.purchases_page.support}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>{dict.user_nav.logout}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
