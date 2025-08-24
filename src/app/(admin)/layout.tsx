
'use client';
import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { UserNav } from '@/components/user-nav';
import { LanguageSwitcher } from '@/components/language-switcher';
import { LayoutDashboard, Users, BarChart, Settings, Bot, ArrowLeft, ShoppingCart, Wallet, Newspaper } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';


export const adminNavItems = [
  { href: '/admin', label: { en: 'Dashboard', ur: 'ڈیش بورڈ' }, icon: LayoutDashboard, permissionKey: 'dashboard' },
  { href: '/admin/orders', label: { en: 'Orders', ur: 'آرڈرز' }, icon: ShoppingCart, permissionKey: 'orders' },
  { href: '/admin/content', label: { en: 'Content', ur: 'مواد' }, icon: Newspaper, permissionKey: 'content' },
  { href: '/admin/payments', label: { en: 'Payments', ur: 'ادائیگیاں' }, icon: Wallet, permissionKey: 'payments' },
  { href: '/admin/chat', label: { en: 'Support Chat', ur: 'سپورٹ چیٹ' }, icon: Bot, permissionKey: 'chat' },
  { href: '/admin/users', label: { en: 'Users', ur: 'صارفین' }, icon: Users, permissionKey: 'users' },
  { href: '/admin/reports', label: { en: 'Reports', ur: 'رپورٹس' }, icon: BarChart, permissionKey: 'reports' },
  { href: '/admin/config', label: { en: 'Configuration', ur: 'کنفیگریشن' }, icon: Settings, permissionKey: 'config' },
];

function AdminSidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const { user } = useAuth();
    
    // This check is crucial. The user object is guaranteed to be non-null here
    // because of the checks in the main AdminLayout component.
    if (!user) return null;
    
    const visibleNavItems = adminNavItems.filter(item => {
        // Admins can see any page they have explicit permission for.
        return user.permissions?.[item.permissionKey as keyof typeof user.permissions];
    });


    return (
        <Sidebar>
            <SidebarHeader>
                 <div className="flex items-center gap-2 p-2">
                     <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <Logo className="h-6 w-6" />
                    </div>
                    <span className="text-lg font-semibold text-primary">PakFiler Admin</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {visibleNavItems.map(item => (
                         <SidebarMenuItem key={item.href}>
                             <Link href={item.href} className="w-full">
                                <SidebarMenuButton
                                    isActive={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))}
                                >
                                    <item.icon />
                                    {t(item.label)}
                                </SidebarMenuButton>
                            </Link>
                         </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                 <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-start">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        {t({en: 'Back to App', ur: 'ایپ پر واپس جائیں'})}
                    </Button>
                </Link>
            </SidebarFooter>
        </Sidebar>
    )
}

function AdminLayoutSkeleton() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
             <div className="flex flex-col items-center gap-2">
                <LayoutDashboard className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading Admin Panel...</p>
            </div>
        </div>
    )
}


export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Wait until authentication check is complete

    if (!user) {
      router.push('/dashboard');
      return;
    }
    
    if (user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    // Once we know it's an admin, we still need to wait for their permissions to load.
    if (user.permissions) {
      const currentRoute = adminNavItems.find(item => pathname.startsWith(item.href) && item.href !== '/admin');
      
      // If there's a specific route being accessed (not the main /admin dashboard)
      // and the user does NOT have permission for it, redirect to the admin dashboard.
      if (currentRoute && !user.permissions[currentRoute.permissionKey as keyof typeof user.permissions]) {
          router.push('/admin'); 
      }
    }
    
  }, [user, loading, router, pathname]);
  
  // Critical Check: Render a skeleton if authentication is loading, 
  // OR if we have a user but their role/permissions haven't been loaded from Firestore yet.
  if (loading || !user || !user.role || (user.role === 'admin' && !user.permissions)) {
    return <AdminLayoutSkeleton />;
  }
  
  // By this point, `user` and `user.role` are guaranteed to be available.
  // We can also be sure `user.permissions` is loaded for admins.
  if (user.role !== 'admin') {
      // This is a fallback, but the useEffect should have already redirected.
      return <AdminLayoutSkeleton />;
  }

  return (
    <SidebarProvider>
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-20 flex h-16 items-center justify-end gap-4 border-b bg-background/80 px-6 backdrop-blur-sm">
                <SidebarTrigger className="mr-auto" />
                <LanguageSwitcher />
                <UserNav />
            </header>
            <main className="flex-1 p-6 bg-muted/20">
                {children}
            </main>
        </div>
    </SidebarProvider>
  );
}
