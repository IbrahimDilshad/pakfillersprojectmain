
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
import { LayoutDashboard, Users, BarChart, Settings, Bot, ArrowLeft } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';


const adminNavItems = [
  { href: '/admin', label: { en: 'User Management', ur: 'صارف کا انتظام' }, icon: Users },
  { href: '/admin/reports', label: { en: 'Reports', ur: 'رپورٹس' }, icon: BarChart },
  { href: '/admin/content', label: { en: 'Content', ur: 'مواد' }, icon: LayoutDashboard },
  { href: '/admin/chat', label: { en: 'Support Chat', ur: 'سپورٹ چیٹ' }, icon: Bot },
  { href: '/admin/config', label: { en: 'Configuration', ur: 'کنفیگریشن' }, icon: Settings },
];

function AdminSidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();

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
                    {adminNavItems.map(item => (
                         <SidebarMenuItem key={item.href}>
                             <Link href={item.href} className="w-full">
                                <SidebarMenuButton
                                    isActive={pathname === item.href}
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

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            {/* You can add a more sophisticated loader here */}
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <SidebarProvider>
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 flex flex-col">
                <header className="flex h-16 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
                    <SidebarTrigger />
                    <div className="flex items-center gap-2 ml-auto">
                        <LanguageSwitcher />
                        <UserNav />
                    </div>
                </header>
                <div className="flex-1 p-6 bg-muted/20">
                    {children}
                </div>
            </main>
        </div>
    </SidebarProvider>
  );
}
