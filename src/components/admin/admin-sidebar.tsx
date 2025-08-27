
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Users, Settings, BarChart, MessageSquare, Newspaper, Video, HelpCircle, CreditCard } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Logo } from "../logo";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/admin", label: { en: "Dashboard", ur: "ڈیش بورڈ" }, icon: Home },
    { href: "/admin/orders", label: { en: "Orders", ur: "آرڈرز" }, icon: ShoppingCart },
    { href: "/admin/users", label: { en: "Users", ur: "صارفین" }, icon: Users },
    { href: "/admin/chat", label: { en: "Chat", ur: "چیٹ" }, icon: MessageSquare },
    { type: 'divider', label: { en: 'Content', ur: 'مواد' } },
    { href: "/admin/content/blogs", label: { en: "Blogs", ur: "بلاگز" }, icon: Newspaper },
    { href: "/admin/content/videos", label: { en: "Videos", ur: "ویڈیوز" }, icon: Video },
    { href: "/admin/content/faqs", label: { en: "FAQs", ur: "اکثر پوچھے گئے سوالات" }, icon: HelpCircle },
    { type: 'divider', label: { en: 'Settings', ur: 'ترتیبات' } },
    { href: "/admin/reports", label: { en: "Reports", ur: "رپورٹس" }, icon: BarChart },
    { href: "/admin/payments", label: { en: "Payments", ur: "ادائیگیاں" }, icon: CreditCard },
    { href: "/admin/config", label: { en: "Configuration", ur: "کنفیگریشن" }, icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();

    return (
        <aside className="w-64 flex-shrink-0 bg-muted/40 border-r hidden md:block">
            <div className="flex flex-col h-full">
                 <div className="flex h-16 items-center px-6 border-b">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                        <Logo className="h-6 w-6 text-primary" />
                        <span>{t({ en: "PakFiler Admin", ur: "پاک فائلر ایڈمن" })}</span>
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-4">
                    <ul className="space-y-1">
                        {navItems.map((item, index) => {
                             if (item.type === 'divider') {
                                return <li key={`divider-${index}`} className="px-3 pt-4 pb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">{t(item.label)}</li>
                            }
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href!}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
                                            pathname === item.href && "bg-primary/10 text-primary font-semibold"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {t(item.label)}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}
