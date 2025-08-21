
'use client';
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Home, Bell, LayoutGrid, Calculator, FileQuestion, Landmark, Users, Building, FileUp, Tv, Rss, User, CreditCard, Shield, ShoppingCart, RotateCw } from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "./language-switcher"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/auth-context";
import { Logo } from "./logo";
import { useNotifications } from "@/hooks/useNotifications";
import { Badge } from "./ui/badge";
import { formatDistanceToNow } from 'date-fns';

interface HeaderProps {
  title: string;
}

const pages = [
  { href: "/gst-registration", title: { en: "GST Registration", ur: "جی ایس ٹی رجسٹریشن" }, icon: Landmark },
  { href: "/family-tax-filing", title: { en: "Family Tax Filing", ur: "فیملی ٹیکس فائلنگ" }, icon: Users },
  { href: "/ntn-registration", title: { en: "NTN Registration", ur: "این ٹی این رجسٹریشن" }, icon: FileUp },
  { href: "/ntn-recovery", title: { en: "NTN Recovery", ur: "این ٹی این کی بازیابی" }, icon: RotateCw },
  { href: "/iris-profile", title: { en: "IRIS Profile", ur: "IRIS پروفائل" }, icon: User },
  { href: "/business-incorporation", title: { en: "Business Incorporation", ur: "کاروبار کی شمولیت" }, icon: Building },
  { href: "/services", title: { en: "Service Charges", ur: "سروس چارجز" }, icon: CreditCard },
  { href: "/salary-tax-calculator", title: { en: "Salary Tax Calculator", ur: "تنخواہ ٹیکس کیلکولیٹر" }, icon: Calculator },
  { href: "/faqs", title: { en: "FAQs", ur: "اکثر پوچھے گئے سوالات" }, icon: FileQuestion },
  { href: "/blog", title: { en: "Blog & Updates", ur: "بلاگ اور اپڈیٹس" }, icon: Rss },
  { href: "/videos", title: { en: "Videos", ur: "ویڈیوز" }, icon: Tv },
]

function NotificationsDropdown() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const { notifications, markAsRead } = useNotifications(user?.uid);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0">{unreadCount}</Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>{t({en: "Notifications", ur: "اطلاعات"})}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">{t({en: "No new notifications.", ur: "کوئی نئی اطلاعات نہیں ہیں۔"})}</p>
                ) : (
                    notifications.map(notification => (
                         <DropdownMenuItem key={notification.id} onClick={() => markAsRead(notification.id)} className="flex flex-col items-start gap-1 p-2">
                           <p className={`text-sm ${!notification.isRead && 'font-bold'}`}>{notification.message}</p>
                           <p className="text-xs text-muted-foreground">{formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true })}</p>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


export function Header({ title }: HeaderProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
       <Link href="/dashboard" className="flex items-center gap-2 mr-auto">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
                <Logo className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold text-primary">PakFiler</span>
        </Link>
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
            <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
            </Button>
        </Link>
        <NotificationsDropdown />

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <LayoutGrid className="h-5 w-5" />
                    <span className="sr-only">Pages</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <div className="grid grid-cols-2 gap-2 p-2">
                {pages.map((page) => (
                    <Link href={page.href} key={page.href} className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="bg-primary/10 text-primary p-3 rounded-full mb-1">
                            <page.icon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium text-foreground text-center">{t(page.title)}</span>
                    </Link>
                ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>

        {user?.role === 'admin' && (
             <Link href="/admin/content">
                <Button variant="ghost" size="icon">
                    <Shield className="h-5 w-5" />
                    <span className="sr-only">Admin</span>
                </Button>
             </Link>
        )}

        <Link href="/cart">
          <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
          </Button>
        </Link>

        <LanguageSwitcher />
        <UserNav />
      </div>
    </header>
  )
}
